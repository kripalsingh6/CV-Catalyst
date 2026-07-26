import Razorpay from "razorpay";
import crypto from "crypto";
import Subscription from "../models/subscription.js";
import User from "../models/user.js";
import dotenv from "dotenv";

dotenv.config();

// Helper to get Razorpay instance safely
const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error("Razorpay credentials (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET) are missing in environment variables");
  }

  return new Razorpay({ key_id, key_secret });
};

const PLAN_AMOUNTS = {
  monthly: 49900, // ₹499 in paise
  yearly: 419900, // ₹4,199 in paise
};

// ─────────────────────────────────────────────
// 1. CREATE ORDER
// ─────────────────────────────────────────────
export const createOrder = async (req, res) => {
  try {
    const { billingCycle } = req.body;

    if (!billingCycle || !PLAN_AMOUNTS[billingCycle]) {
      return res.status(400).json({
        success: false,
        message: "Invalid billing cycle. Options are 'monthly' or 'yearly'.",
      });
    }

    const amount = PLAN_AMOUNTS[billingCycle];
    const razorpay = getRazorpayInstance();

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `receipt_${req.user._id}_${Date.now()}`,
      notes: {
        userId: req.user._id.toString(),
        billingCycle,
      },
    });

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("❌ Razorpay Create Order Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create payment order",
      error: error.message,
    });
  }
};

// payment verify

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      billingCycle = "monthly",
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification parameters",
      });
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_secret) {
      return res.status(500).json({
        success: false,
        message: "Razorpay key secret is not configured on server",
      });
    }

    // Verify HMAC SHA256 signature
    const generatedSignature = crypto
      .createHmac("sha256", key_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature. Payment verification failed.",
      });
    }

    // Fetch payment details from Razorpay for audit
    const razorpay = getRazorpayInstance();
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    const now = new Date();
    const periodEnd = new Date(now);
    if (billingCycle === "monthly") {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    } else {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    }

    // Upsert subscription record in database
    const subscription = await Subscription.findOneAndUpdate(
      { user: req.user._id },
      {
        user: req.user._id,
        stripeCustomerId: req.user._id.toString(),
        stripeSubscriptionId: razorpay_order_id,
        plan: "pro",
        status: "active",
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd: false,
        $push: {
          payments: {
            stripePaymentIntentId: razorpay_payment_id,
            amount: payment.amount,
            currency: payment.currency || "INR",
            status: "succeeded",
            paidAt: now,
          },
        },
      },
      { upsert: true, new: true }
    );

    // Upgrade User subscription field to 'pro'
    await User.findByIdAndUpdate(req.user._id, { subscription: "pro" });

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully! Welcome to Pro.",
      subscription,
    });
  } catch (error) {
    console.error("❌ Razorpay Payment Verification Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// 3. GET SUBSCRIPTION DETAILS
// ─────────────────────────────────────────────
export const getSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ user: req.user._id });

    return res.status(200).json({
      success: true,
      subscription: subscription || {
        user: req.user._id,
        plan: req.user.subscription || "free",
        status: "active",
      },
    });
  } catch (error) {
    console.error("❌ Get Subscription Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch subscription details",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// 4. WEBHOOK HANDLER
// ─────────────────────────────────────────────
export const handleWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    if (webhookSecret && signature) {
      const shasum = crypto.createHmac("sha256", webhookSecret);
      shasum.update(JSON.stringify(req.body));
      const digest = shasum.digest("hex");

      if (digest !== signature) {
        return res.status(400).json({ message: "Invalid webhook signature" });
      }
    }

    const event = req.body.event;
    console.log("🔔 Razorpay Webhook Event Received:", event);

    if (event === "payment.captured") {
      const paymentEntity = req.body.payload.payment.entity;
      const userId = paymentEntity.notes?.userId;
      if (userId) {
        await User.findByIdAndUpdate(userId, { subscription: "pro" });
      }
    }

    return res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("❌ Webhook Error:", error.message);
    return res.status(500).json({ message: "Webhook handler failed", error: error.message });
  }
};
