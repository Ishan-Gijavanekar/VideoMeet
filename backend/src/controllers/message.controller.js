import Message from "../models/message.model.js";

const createMessage = async (req, res) => {
    try {
        const {content, type} = req.body;
        const {id} = req.params;
        const senderId = req.user.userId;

        if (!content || !type) {
            return res.status(400).json({message: "All fields are required"});
        }

        const message = new Message({
            rooomId: id,
            senderId,
            content,
            type
        });

        await message.save();
        res.status(200)
        .json({
            newMessage: message,
            message: "Message created successfully"
        })
    } catch (error) {
        console.log(`Error in create message controller: ${error}`);
        res.status(500).json({message: "Internal server error"});
    }
}

const getMessageByRoom = async(req, res) => {
    try {
        const {id} = req.params;
        const messages = await Message.findById(id).populate("senderId", "username", "email").sort({createdAt: -1});

        res.status(200)
        .json({
            messages,
            message: "Messages fetched successfully"
        });
    } catch (error) {
        console.log(`Error in get message by room controller: ${error}`);
        res.status(500).json({message: "Internal server error"});
    }
}

const deleteMessage = async(req, res) => {
    try {
        const {id} = req.params;
        const message  = await Message.findById(id);

        if (!message) {
            return res.status(404).json({message: "Message not found"});
        }

        await Message.findByIdAndDelete(id);

        res.status(200)
        .json({
            message: "Message deleted successfully"
        })
    } catch (error) {
        console.log(`Error in delete message controller: ${error}`);
        res.status(500).json({message: "Internal server error"});
    }
}

export {createMessage, getMessageByRoom, deleteMessage};