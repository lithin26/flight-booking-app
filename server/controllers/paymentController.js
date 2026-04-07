import Razorpay from "razorpay";
import crypto from "crypto";

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const key_id = process.env.RAZORPAY_KEY_ID?.trim();
    const key_secret = process.env.RAZORPAY_KEY_SECRET?.trim();

    if (!key_id || !key_secret) {
      console.error("Razorpay Payment Error: Missing credentials in .env");
      return res.status(500).json({ message: "Razorpay credentials not configured on server" });
    }

    const instance = new Razorpay({
      key_id,
      key_secret,
    });

    // Ensure amount is an integer (paise)
    const options = {
      amount: Math.round(Number(amount) * 100), 
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`
    };

    console.log(`Initializing Razorpay Order: ${options.amount} paise`);
    const order = await instance.orders.create(options);

    if (!order) {
      console.error("Razorpay Error: Order creation returned empty result");
      return res.status(500).json({ message: "Order creation failed" });
    }

    res.json(order);
  } catch (error) {
    console.error("Razorpay Controller Error: ", error);
    res.status(500).json({ message: "Failed to create payment order", error: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const key_secret = process.env.RAZORPAY_KEY_SECRET?.trim();

    const expectedSignature = crypto
      .createHmac("sha256", key_secret)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Payment completely verified
      res.status(200).json({ 
        message: "Payment successfully verified",
        paymentId: razorpay_payment_id
      });
    } else {
      res.status(400).json({ message: "Invalid Signature" });
    }
  } catch (error) {
    console.error("Verification Error: ", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
