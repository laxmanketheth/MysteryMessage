import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/User";
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();
    // console.log('MongoDB connection established');//////
    try {

        const { username, email, password } = await request.json()
        // console.log('signup route line 12',username, email, password);
        
        const existingUserVerifiedByUsername = await UserModel.
            findOne({
                username,
                isVerified: true
            });
            // console.log('user exists by email on line 19 in signup route',existingUserVerifiedByUsername);
            

        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, { status: 400 })
        }
        const existingUserByEmail = await UserModel.findOne({ email })
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString() //generating verification code
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User already exists with this email"
                }, { status: 400 })
            }
            else {
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashedPassword,
                    existingUserByEmail.verifyCode = verifyCode,
                    existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()
            }
        } else {

            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)
            
            const newUSer = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: false,
                messages: []
            })
            await newUSer.save()
        };

        // ** send verification email ** //
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )
        // console.log('email response in line 69 backend route',emailResponse);
        
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, { status: 500 })
        }
        return Response.json({
            success: true,
            message: "User registered successfully. Please verify your email"
        }, { status: 201 })

    } catch (error) {
        console.error('Error registering user', error)
        return Response.json(
            {
                success: false,
                message: "Error registering user"
            },
            {
                status: 500
            }
        )
    };
};