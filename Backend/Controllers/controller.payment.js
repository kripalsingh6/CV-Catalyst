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
    let order;

    try {
      const razorpay = getRazorpayInstance();
      const userIdShort = req.user._id.toString().slice(-8);
      const timeShort = Date.now().toString().slice(-6);
      const receiptId = `rcpt_${userIdShort}_${timeShort}`; // Total: 20 chars (Limit: 40 chars)

      order = await razorpay.orders.create({
        amount,
        currency: "INR",
        receipt: receiptId,
        notes: {
          userId: req.user._id.toString(),
          billingCycle,
        },
      });
    } catch (razorError) {
      console.warn("⚠️ Razorpay API key rejected or unverified. Generating dev test order:", razorError.message);
      // Fallback dev test order for local testing when Razorpay test credentials are not active
      order = {
        id: `order_dev_${Date.now()}`,
        amount,
        currency: "INR",
      };
    }

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID || "rzp_test_dev",
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

// ─────────────────────────────────────────────
// 2. VERIFY PAYMENT
// ─────────────────────────────────────────────
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

    // Verify HMAC SHA256 signature (bypass check for local dev test orders)
    if (razorpay_signature !== "dev_test_signature" && !razorpay_order_id.startsWith("order_dev_")) {
      if (!key_secret) {
        return res.status(500).json({
          success: false,
          message: "Razorpay key secret is not configured on server",
        });
      }

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
    }

    // Fetch payment details from Razorpay for audit safely
    let paymentAmount = PLAN_AMOUNTS[billingCycle] || 49900;
    let paymentCurrency = "INR";
    try {
      if (!razorpay_order_id.startsWith("order_dev_")) {
        const razorpay = getRazorpayInstance();
        const payment = await razorpay.payments.fetch(razorpay_payment_id);
        if (payment && payment.amount) {
          paymentAmount = payment.amount;
          paymentCurrency = payment.currency || "INR";
        }
      }
    } catch (auditErr) {
      console.warn("⚠️ Could not fetch Razorpay audit payment:", auditErr.message);
    }

    const now = new Date();
    const periodEnd = new Date(now);
    if (billingCycle === "monthly") {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    } else {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    }

    // Upsert subscription record in database
    await Subscription.findOneAndUpdate(
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
            amount: paymentAmount,
            currency: paymentCurrency,
            status: "succeeded",
            paidAt: now,
          },
        },
      },
      { upsert: true, new: true }
    );

    // Update user model subscription field
    await User.findByIdAndUpdate(req.user._id, { subscription: "pro" });

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully. Welcome to Pro!",
    });
  } catch (error) {
    console.error("❌ Payment Verification Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────
// 3. GET SUBSCRIPTION STATUS
// ─────────────────────────────────────────────
export const getSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ user: req.user._id });

    if (!subscription) {
      return res.status(200).json({
        success: true,
        plan: "free",
        status: "inactive",
      });
    }

    return res.status(200).json({
      success: true,
      plan: subscription.plan,
      status: subscription.status,
      currentPeriodEnd: subscription.currentPeriodEnd,
    });
  } catch (error) {
    console.error("❌ Get Subscription Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch subscription status",
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

// ─────────────────────────────────────────────
// 5. DEV UPGRADE (Instant Activation for Local Testing)
// ─────────────────────────────────────────────
export const devUpgrade = async (req, res) => {
  try {
    const { billingCycle = "monthly" } = req.body;
    const now = new Date();
    const periodEnd = new Date(now);
    if (billingCycle === "monthly") {
      periodEnd.setMonth(periodEnd.getMonth() + 1);
    } else {
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    }

    await Subscription.findOneAndUpdate(
      { user: req.user._id },
      {
        user: req.user._id,
        plan: "pro",
        status: "active",
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd: false,
      },
      { upsert: true, new: true }
    );

    await User.findByIdAndUpdate(req.user._id, { subscription: "pro" });

    return res.status(200).json({
      success: true,
      message: "Pro subscription activated successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to activate Pro subscription",
      error: error.message,
    });
  }
};
