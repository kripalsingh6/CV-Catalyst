const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
     stripeCustomerId: {
      type: String,
      required: true,
    },
    stripeSubscriptionId: {
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
      ],
      default: "active",
    },
    currentPeriodStart: { 
        type: Date,
         default: null 
        },
    currentPeriodEnd: { 
        type: Date, 
        default: null 
    },
     cancelAtPeriodEnd: { 
        type: Boolean, 
        default: false 
    },
        payments: [
      {
        stripePaymentIntentId: String,
        amount: Number,          // in paise/cents
        currency: { type: String, default: "inr" },
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

SubscriptionSchema.index({ stripeCustomerId: 1 });
SubscriptionSchema.index({ stripeSubscriptionId: 1 });
SubscriptionSchema.index({ user: 1 });

module.exports = mongoose.model("Subscription", SubscriptionSchema);