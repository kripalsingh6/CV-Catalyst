import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    razorpayCustomerId: {
      type: String,
      default: "",
    },
    razorpayOrderId: {
      type: String,
      required: true,
    },
    plan: {
      type: String,
      enum: ["free", "pro"],
      default: "free",
    },

    status: {
      type: String,
      enum: [
        "active",
        "canceled",
        "past_due",
        "trialing",
        "incomplete",
        "unpaid",
        "inactive",
      ],
      default: "active",
    },
    currentPeriodStart: {
      type: Date,
      default: null,
    },
    currentPeriodEnd: {
      type: Date,
      default: null,
    },
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false,
    },
    payments: [
      {
        razorpayPaymentId: String,
        amount: Number, // in paise
        currency: { type: String, default: "INR" },
        status: {
          type: String,
          enum: ["succeeded", "failed", "pending", "refunded"],
        },
        paidAt: { type: Date },
        invoiceUrl: String,
      },
    ],
  },
  { timestamps: true }
);

SubscriptionSchema.index({ razorpayCustomerId: 1 });
SubscriptionSchema.index({ razorpayOrderId: 1 });

const Subscription = mongoose.model("Subscription", SubscriptionSchema);
export default Subscription;