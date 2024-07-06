import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  amount: Number,
  description: String,
  stripePaymentId: String,
});

export default mongoose.model("Payment", PaymentSchema)