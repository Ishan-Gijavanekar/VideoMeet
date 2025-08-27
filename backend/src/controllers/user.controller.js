import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

const register = async(req, res) => {
    try {
        const {username, email, password} = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({message: "All fields are required"});
        }

        const userExsists = await User.findOne({email});
        if (userExsists) {
            return res.status(400).json({message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        res.status(201)
        .json({
            user,
            message: "User created successfully"
        })


    } catch (error) {
        console.log(`Error in register controller: ${error}`);
        res.status(500).json({message: "Internal server error"});
    }
}

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({message: "All fields are required"});
        }
        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({message: "Invalid credentials"});
        }

        const token = jwt.sign(
            {userId: user._id},
            process.env.JWT_SECRET,
            {expiresIn: process.env.JWT_EXPIRY}
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200)
        .json({
            user,
            token,
            message: "Login successful"
        });
    } catch (error) {
        console.log(`Error in login controller: ${error}`);
        res.status(500).json({message: "Internal server error"});
    }
}

const logout = async(req, res) => {
    try {
        res.clearCookie("token");
        res.status(200)
        .json({
            message: "Logout successful"
        })
    } catch (error) {
        console.log(`Error in logout controller: ${error}`);
        res.status(500).json({message: "Internal server error"});
    }
}

const getUser = async(req, res) => {
    try {
        const id = req.user.userId;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        res.status(200)
        .json({
            user,
            message: "User fetched successfully"
        });
    } catch (error) {
        console.log(`Error in get user controller: ${error}`);
        res.status(500).json({message: "Internal server error"});
    }
}

const getUserById = async(req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        res.status(200)
        .json({
            user,
            message: "User fetched successfully"
        });
    } catch (error) {
        console.log(`Error in get user by id controller: ${error}`);
        res.status(500).json({message: "Internal server error"});
    }
}

const updateUser = async(req, res) => {
    try {
        const id = req.user.userId;
        const {username, email} = req.body;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        user.username = username;
        user.email = email;
        await user.save();
        res.status(200)
        .json({
            user,
            message: "User updated successfully"
        });
    } catch (error) {
        console.log(`Error in update user controller: ${error}`);
        res.status(500).json({message: "Internal server error"});
    }
}

const deleteUser = async(req, res) => {
    try {
        const id = req.user.userId;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        res.status(200)
        .json({
            user,
            message: "User deleted successfully"
        });
    } catch (error) {
        console.log(`Error in delete user controller: ${error}`);
        res.status(500).json({message: "Internal server error"});
    }
}

export {register, login, getUser, getUserById, updateUser, deleteUser, logout};