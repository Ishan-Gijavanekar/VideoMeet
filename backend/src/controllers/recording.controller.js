import Recording from "../models/recording.model.js";

const uploadRecording = async(req, res) => {
    try {
        const {roomId, duration} = req.body;
        const userId = req.user.userId;
        const filePath = req.file?.path;

        if (!roomId || !duration || !filePath) {
            return res.status(400).json({message: "All fields are required"});
        }

        const recording = new Recording({
            roomId,
            recordedBy: userId,
            filePath,
            duration
        });

        await recording.save();
        res.status(200)
        .json({
            recording,
            message: "Recording uploaded successfully"
        })
    } catch (error) {
        console.log(`Error in upload recording controller: ${error}`);
        res.status(500).json({message: "Internal server error"});
    }
}

const getRecordingByRoom = async(req, res) => {
    try {
        const {id} = req.params;

        const recordings = await Recording.find({roomId: id})
        .populate("recordedBy", "username email")
        .sort({createdAt: -1});

        res.status(200)
        .json({
            recordings,
            message: "Recordings fetched successfully"
        })
    } catch (error) {
        console.log(`Error in get recording by room controller: ${error}`);
        res.status(500).json({message: "Internal server error"});
    }
}

const deleteRecording = async(req, res) => {
    try {
        const {id} = req.params;
        const recording = await Recording.findByIdAndDelete(id);
        if (!recording) {
            return res.status(404).json({message: "Recording not found"});
        }
        res.status(200)
        .json({
            message: "Recording deleted successfully"
        })
    } catch (error) {
        console.log(`Error in delete recording controller: ${error}`);
        res.status(500).json({message: "Internal server error"});
    }
}

export {uploadRecording, getRecordingByRoom, deleteRecording};