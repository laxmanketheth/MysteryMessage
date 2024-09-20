import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const MONGODB_URI = process.env.MONGODB_URI;
const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to database");
        return
    }
    try {
        const db = await mongoose.connect(MONGODB_URI as string)
        // console.log('db data',db.connections[0]);

        connection.isConnected = db.connections[0].readyState
        // console.log("DB Connected successfully");

    } catch (error) {
        console.log("Database Connection failed");

        process.exit(1)
    }
}

export default dbConnect;

