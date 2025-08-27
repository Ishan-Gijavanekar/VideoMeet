import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    rooomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['text', 'system'],
        required: true,
    }
}, {
    timestamps: true,
});

const Message = mongoose.model('Message', messageSchema);

export default Message;