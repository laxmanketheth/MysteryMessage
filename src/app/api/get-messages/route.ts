import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";


export async function GET(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User //typescript assertion
    // console.log("session",session);
    
// console.log('this is user in get-messages api line 14',user);

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            { status: 401 }
        )
    }

    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        //below we are using aggreagtion pipeline in mongodb
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        ])
        // console.log('user with msgs',user);
        
        if (!user || user.length === 0) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                { status: 401 }
            )
        }

        return Response.json(
            {
                success: true,
                message: user[0].messages
            },
            { status: 200 }
        )
    } catch (error) {
        console.log("an unexpected error occured:" , error);
        
        return Response.json(
            {
                success: false,
                message: "Error in getting messages"
            },
            { status: 500 }
        )
    }
}