import express from "express";
import Stripe from 'stripe';
import Payment from '../models/Payment.js'

const router = express.Router();

const stripe = Stripe('sk_test_51Jk3wFHiK2EieueLck7h4FcupafCFdkExATmRf8CePM9ucDUP1RIxxYvINGSyNE06JXhR6rft0skc8Yl5kjII7Y900zClLsTIM');

router.post('/create-payment-intent', async (req, res) => {
  const { amount, description } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Amount in cents
      currency: 'usd',
      description,
    });

    // Save the payment intent details to the database
    const payment = new Payment({
      amount,
      description,
      stripePaymentId: paymentIntent.id,
    });
    await payment.save();

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;