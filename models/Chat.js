import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
    // clientParticipants: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Client' // Reference to Client model
    // }],
    // professionalParticipants: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Professional' // Reference to Professional model
    // }],
    clientParticipant: {
        type: String,
        required: true
    },
    professionalParticipant: {
        type: String,
        required: true
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message' // Reference to Message model
    }],
    // Add any other fields specific to the chat model
}, { timestamps: true });

export default mongoose.model("Chat", ChatSchema)

