import Room from "../models/room.model.js";
import User from "../models/user.model.js";
import History from "../models/history.model.js";
import Recording from "../models/recording.model.js";
import Message from "../models/message.model.js";


const generateMeetingCode = () => {
    const char = 'abcdefghijklmnopqrstuvwxyz';
    const getword = (length) => {
        Array.from({length}, () => char[Math.floor(Math.random() * char.length)]).join('');
    }
    return `${getword(3)}-${getword(3)}-${getword(3)}`;
}

const createRoom = async(req, res) => {
    try {
        const roomname = await Room.find().select("name");
        const name = generateMeetingCode();
        for (let i = 0; i< roomname.length; i++) {
            if (roomname[i].name === name) {
                name = generateMeetingCode();
            }
        }
        if (!name) {
            return res.status(400).json({message: "All fields are required"});
        }
        const createdBy = req.user.userId;
        const user = await User.findById(createdBy);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        const room = new Room({
            name,
            createdBy,
            participants: [createdBy]
        });
        await room.save();
        res.status(201)
        .json({
            room,
            message: "Room created successfully"
        })
    } catch (error) {
        console.log(`Error in create room controller: ${error}`);
        res.status(500).json({message: "Internal server error"});
    }
}

const joinRoom = async(req, res) => {
    try {
        const name = req.body.name;
        if (!name) {
            return res.status(400).json({message: "All fields are required"});
        }
        const userId = req.user.userId;
        const room = await Room.findOne({name});
        if (!room) {
            return res.status(404).json({message: "Room not found"});
        }
        if (!room.participants.includes(userId)) {
            room.participants.push(userId);
            await room.save();
            await History.create({roomId: room._id, events: [{type: "join", user: userId}]});
            res.status(200)
            .json({
                room,
                message: "Room joined successfully"
            })
        }
    } catch (error) {
        console.log(`Error in join room controller: ${error}`);
        res.status(500).json({message: "Internal server error"});
    }
}

const leaveRoom = async(req, res) => {
    try {
        const {roomId} = req.paramas;
        const userId = req.user.userId;
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({message: "Room not found"});
        }
        if (room.participants.includes(userId)) {
            room.participants = room.participants.filter((id) => id.toString() !== userId);
            await room.save();
            await History.create({roomId: room._id, events: [{type: "leave", user: userId}]});
            res.status(200)
            .json({
                room,
                message: "Room left successfully"
            })
        }
    } catch (error) {
        console.log(`Error in leave room controller: ${error}`);
        res.status(500).json({message: "Internal server error"});
    }
} 

const getRoomDetails = async(req, res) => {
    try {
        const {id} = req.params;
        const room = await Room.findById(id);
        if (!room) {
            return res.status(404).json({message: "Room not found"});
        }
        res.status(200)
        .json({
            room,
            message: "Room details fetched successfully"
        })
    } catch (error) {
        console.log(`Error in get room details controller: ${error}`);
        res.status(500).json({message: "Internal server error"});
    }
}

const getParticipants = async(req, res) => {
    try {
        const {id} = req.params;
        const room = await Room.findById(id).populate("participants", 'username');
        if (!room) {
            return res.status(404).json({message: "Room not found"});
        }

        res.status(200)
        .json({
            participants: room.participants,
            message: "Participants fetched successfully"
        })

    } catch (error) {
        console.log(`Error in get participants controller: ${error}`);
        res.status(500).json({message: "Internal server error"});
    }
}

const getRoomMessages = async(req, res) => {
    try {
        const {id} = req.params;
        const room = await Room.findById(id);
        if (!room) {
            return res.status(404).json({message: "Room not found"});
        }
        const messages = await Message.find({roomId: id});
        res.status(200)
        .json({
            messages,
            message: "Room messages fetched successfully"
        })
    } catch (error) {
        console.log(`Error in get room messages controller: ${error}`);
        res.status(500).json({message: "Internal server error"});
    }
}

const getRoomRecording = async(req, res) => {
    try {
        const {id} = req.params;
        const room = await Room.findById(id);
        if (!room) {
            return res.status(404).json({message: "Room not found"});
        }
        const recordings = await Recording.find({roomId: id});
        res.status(200)
        .json({
            recordings,
            message: "Room recordings fetched successfully"
        })
    } catch (error) {
        console.log(`Error in get room recordings controller: ${error}`);
        res.status(500).json({message: "Internal server error"});
    }
}

const getRoomHistory = async(req, res) => {
    try {
        const {id} = req.params;
        const room = await Room.findById(id);
        if (!room) {
            return res.status(404).json({message: "Room not found"});
        }
        const history = (await History.find({roomId: id}).populate("events.user", 'username')).sort({createdAt: -1});
        res.status(200)
        .json({
            history,
            message: "Room history fetched successfully"
        })
    } catch (error) {
        console.log(`Error in get room history controller: ${error}`);
        res.status(500).json({message: "Internal server error"});
    }
}

const deactivateRoom = async(req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({message: "Room not found"});
        }
        const userId = req.user.userId;
        if (room.createdBy.toString() !== userId) {
            return res.status(403).json({message: "You are not authorized to deactivate this room"});
        }
        room.isActive = false;
        await room.save();
        res.status(200)
        .json({
            room,
            message: "Room deactivated successfully"
        })
    } catch (error) {
        console.log(`Error in deactivate room controller: ${error}`);
        res.status(500).json({message: "Internal server error"});
    }
}

const deleteRoom = async(req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (!room) {
            return res.status(404).json({message: "Room not found"});
        }
        await Room.findByIdAndDelete(req.params.id);
        res.status(200)
        .json({
            room,
            message: "Room deleted successfully"
        })
    } catch (error) {
        console.log(`Error in delete room controller: ${error}`);
        res.status(500).json({message: "Internal server error"});
    }
}

export {createRoom, joinRoom, leaveRoom, getRoomDetails, getParticipants, getRoomMessages, getRoomRecording, getRoomHistory, deactivateRoom, deleteRoom};