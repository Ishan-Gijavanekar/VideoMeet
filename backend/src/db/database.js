import mongoose from 'mongoose'

const connectDb = async() => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connected to database ${connection.connection.host}`);
    } catch (error) {
        console.log("Error in connecting to database", error);
        process.exit(1);
    }
}

export {connectDb};