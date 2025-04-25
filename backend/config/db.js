import mongoose from "mongoose";

export const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    } catch (err) {
        console.log(`Error: ${err.message}`);
        setTimeout(connectDatabase, 5000);
    }
};
