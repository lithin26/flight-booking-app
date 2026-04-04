import express from "express";
import { createOrder, verifyPayment } from "../controllers/paymentController.js";

const Router = express.Router();

Router.post('/create-razorpay-order', createOrder);
Router.post('/verify-razorpay-payment', verifyPayment);

export default Router;
