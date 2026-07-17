import Razorpay from "razorpay";
import crypto from "crypto";
import Subscription from "../models/subscription.js";
import User from "../models/user.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const PLAN_AMOUNTS = {
  monthly: 49900,   // ₹499
  yearly: 419900,   // ₹4,199
};

// CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const { billingCycle } = req.body;

    if (!PLAN_AMOUNTS[billingCycle]) {
      return res.status(400).json({ message: "Invalid billing cycle" });
    }

    const amount = PLAN_AMOUNTS[billingCycle];

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
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create order",
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
      billingCycle,
    } = req.body;

    // Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Fetch payment details for record-keeping
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    const now = new Date();
    const periodEnd = new Date(now);
    if (billingCycle === "monthly") periodEnd.setMonth(periodEnd.getMonth() + 1);
    else periodEnd.setFullYear(periodEnd.getFullYear() + 1);

    // Upsert subscription record
    await Subscription.findOneAndUpdate(
      { user: req.user._id },
      {
        user: req.user._id,
        stripeCustomerId: req.user._id.toString(), // placeholder if not using Stripe
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
            currency: payment.currency,
            status: "succeeded",
            paidAt: now,
          },
        },
      },
      { upsert: true, new: true }
    );

    // Upgrade user's plan
        await User.findByIdAndUpdate(req.user._id, { subscription: "pro" });
    
        return res.status(200).json({ message: "Payment verified successfully" });
      } catch (error) {
        return res.status(500).json({
          message: "Payment verification failed",
          error: error.message,
        });
      }
    }
