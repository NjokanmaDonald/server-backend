import mongoose from "mongoose";

const ProfessionalSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profession: {
        type: String,
        enum: ['Carpentry', 'Plumbing', 'Electrician', 'Cleaning', "IT"],
    },
    profilePicture: {
        type: String,
    },
    approved: {
        type: Boolean,
        default: false,
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
            default: 'Point',
        },
        coordinates: {
            type: [Number],
            required: true,
            default: [0, 0], // Default coordinates (e.g., [longitude, latitude])
        },
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    rating: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

ProfessionalSchema.index({ location: '2dsphere' });

export default mongoose.model("Professional", ProfessionalSchema);


