import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User //typescript assertion

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            { status: 401 }
        )
    }

    const userId = user._id;
    const { acceptMessages } = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages },
            { new: true } //returns the updated value
        )

        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "'Unable to find user to update message acceptance statu"
                },
                { status: 404 }
            )
        };

        //======== Successfully updated message acceptance status ========//
        return Response.json(
            {
                success: true,
                message: "Message acceptance status updated successfully",
                updatedUser
            },
            { status: 200 }
        )


    } catch (error) {
        console.log("Error updating message acceptance status");
        return Response.json(
            {
                success: false,
                message: "Error updating message acceptance status"
            },
            { status: 500 }
        );
    }
};


export async function GET(request: Request) {
    await dbConnect()
    // console.log('checking issue at accept-message file at line 67');

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User //typescript assertion
    // console.log("user in accept-msg line 71", user);

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            { status: 401 }
        )
    }

    const userId = user._id;

    try {
        const foundUser = await UserModel.findById(userId)
        if (!foundUser) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                { status: 404 }
            )
        }
        return Response.json(
            {
                success: true,
                isAcceptingMessages: foundUser.isAcceptingMessage
            },
            { status: 200 }
        )
    } catch (error) {
        console.log("failed to update user status to accept messages");
        return Response.json(
            {
                success: false,
                message: "Error in getting message acceptance status"
            },
            { status: 500 }
        )
    }
};