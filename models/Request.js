import mongoose from "mongoose";

const RequestSchema = new mongoose.Schema({
  clientId: {
    type: String,
    // ref: 'Client',
    required: true
  },
  client: {
	type: String,
	// required: true
  },
  professionalId: {
    type: String,
    // ref: 'Professional',
    required: true
  },
  professional:{
	type: String,
	// required: true
  },
  amount:{
    type: Number
  },
  description:{
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'cancelled', 'completed', 'payed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Request", RequestSchema)