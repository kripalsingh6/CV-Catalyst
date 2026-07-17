import express from "express";
const router = express.Router();

import { createOrder, verifyPayment } from "../Controllers/controller.payment.js";
import { auth } from "../middleware/middleware.auth.js";

router.post("/create-order", auth, createOrder);
router.post("/verify", auth, verifyPayment);

export default router;