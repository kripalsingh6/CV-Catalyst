import express from "express";
import {
  createOrder,
  verifyPayment,
  getSubscription,
  handleWebhook,
} from "../Controllers/controller.payment.js";
import auth from "../middleware/middleware.auth.js";

const router = express.Router();

// Order creation & payment verification
router.post("/create-order", auth, createOrder);
router.post("/verify", auth, verifyPayment);

// Fetch user subscription status
router.get("/subscription", auth, getSubscription);

// Webhook endpoint
router.post("/webhook", handleWebhook);

export default router;
