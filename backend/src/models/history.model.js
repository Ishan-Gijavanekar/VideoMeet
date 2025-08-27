import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
    },
    events: [{
        type: {
            type: String,
            required: true,
            enum: ["join", "leave", "message", "recording"],
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        timestamps: {
            type: Date,
            default: Date.now
        },
        details: {
            type: String
        }
    }]
}, {
    timestamps: true,
});

const History = mongoose.model('History', historySchema);

export default History;