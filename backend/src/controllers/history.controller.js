import History from "../models/history.model.js";

const addEventToHistory = async(req, res) => {
    try {
        const {roomId, type, details} = req.body;
        const userId = req.user.userId;
        if (!roomId || !type || !details) {
            return res.status(400).json({message: "All fields are required"});
        }

        const event = {type, user: userId, details};
        const history = await History.findOne({roomId});
        if (!history) {
            const newHistory = new History({roomId, events: [event]});
            await newHistory.save();
        } else {
            history.events.push(event);
            await history.save();
        }

        res.status(200)
        .json({
            history,
            message: "Event added to history successfully"
        })
    } catch (error) {
        console.log(`Error in add event to history controller: ${error}`);
        res.status(500).json({message: "Internal server error"});
    }
}

const getHistoryByRoom = async(req, res) => {
    try {
        const {id} = req.params;

        const history = await History.findOne({roomId: id}).populate("events.user", 'username email');
        if (!history) {
            return res.status(404).json({message: "History not found"});
        }

        res.status(200)
        .json({
            history,
            message: "History fetched successfully"
        })
    } catch (error) {
        console.log(`Error in get history by room controller: ${error}`);
        res.status(500).json({message: "Internal server error"});
    }
}

const deleteHistoryByRoom = async(req, res) => {
    try {
        const {id} = req.params;
        const history = await History.findOneAndDelete({roomId: id});
        if (!history) {
            return res.status(404).json({message: "History not found"});
        }

        res.status(200)
        .json({
            message: "History deleted successfully"
        })
    } catch (error) {
        console.log(`Error in delete history by room controller: ${error}`);
        res.status(500).json({message: "Internal server error"});
    }
}

export {addEventToHistory, getHistoryByRoom, deleteHistoryByRoom};