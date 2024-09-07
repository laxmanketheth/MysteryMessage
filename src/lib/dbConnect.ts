import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to database");
        return
    }
    try {
        const db = await mongoose.connect("mongodb+srv://laxmanketheth76:laxman123@cluster1.9ixhwqi.mongodb.net/mystry_message")
        //   console.log(db);
        // console.log(db.connections[0]);
        // console.log('on dbconnect file at line 18 before db connection success');

        connection.isConnected = db.connections[0].readyState
        console.log("DB Connected successfully");

    } catch (error) {
        console.log("Database Connection failed");

        process.exit(1)
    }
}

export default dbConnect;

