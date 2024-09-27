import { resend } from "@/lib/resend";
import VerificationEmail from '../../emails/VerificationEmail';
import { ApiResponse } from '@/types/ApiResponse';

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {

    //setting up Resend to send the opt email to user//
    try {
        // console.log('this is email inside sendVerificationEmail file line 13',email);
        
      const response =  await resend.emails.send({
            from: 'mysterymsg@resend.dev',
            to: email,
            subject: 'Mystery message | verification code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });
        console.log('this is response inside sendVerificationEmail file line 21',response);
        return { success: true, message: 'Verification email sent successfully' }

    } catch (emailError) {
        console.error("Error sending verification email", emailError)
        return { success: false, message: 'Failed to send verification email' }
    }
}