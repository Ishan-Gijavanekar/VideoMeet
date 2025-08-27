import mongoose from 'mongoose';

const recordingSchema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true,
    },
    recordedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    filePath: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    }
}, {
    timestamps: true,
});

const Recording = mongoose.model('Recording', recordingSchema);

export default Recording;