
import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
	// clientSender: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: 'Client'
  //   },
  // sender: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Professional'
  // },
  sender: {
    type: String,
    required: true
  },
  receiver: {
    type: String,
    required: true
  },
  content: {
    type: String,
  },
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
  },
  // chat: {
  //   type: String
  // }
},{ timestamps: true });

export default mongoose.model("Message", MessageSchema)
