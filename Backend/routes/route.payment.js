import express from "express";
import {
  createOrder,
  verifyPayment,
  getSubscription,
  handleWebhook,
  devUpgrade,
} from "../Controllers/controller.payment.js";
import auth from "../middleware/middleware.auth.js";

const router = express.Router();

// Order creation & payment verification
router.post("/create-order", auth, createOrder);
router.post("/verify", auth, verifyPayment);
router.post("/dev-upgrade", auth, devUpgrade);

// Fetch user subscription status
router.get("/subscription", auth, getSubscription);

// Webhook endpoint
router.post("/webhook", handleWebhook);

export default router;
