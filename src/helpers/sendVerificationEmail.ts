
/// email verification implementation ////

import { ApiResponse } from '@/types/ApiResponse';

const brevo = require('@getbrevo/brevo');
let apiInstance = new brevo.TransactionalEmailsApi();

let apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = process.env.BREVO_API_KEY

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        let sendSmtpEmail =  new brevo.SendSmtpEmail();

        sendSmtpEmail.subject = "Mystery Msg Verification Code";
        sendSmtpEmail.htmlContent = `<html><body><h2>Hello ${username}</h2><h4>Thank you for registering with Mystery Msg. Please use the following verification code to complete your registration: </h4><h1>${verifyCode}</h1></body></html>`;
        sendSmtpEmail.sender = { "name": "Mystery Msg", "email": "laxmanketheth76@gmail.com" };
        sendSmtpEmail.to = [
            { "email" : email , "name": "Mystery Msg"}
        ];
        sendSmtpEmail.replyTo = { "email": "laxmanketheth76@gmail.com", "name": "Mystery Msg" };
        sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };
        // sendSmtpEmail.params = { "" };

        await apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data:any) {
            console.log('API called successfully. Returned data: ' + JSON.stringify(data));
        }, function (error:any) {
            console.error(error);
        });

        return { success: true, message: 'Verification email sent successfully' }


    } catch (emailError) {
        console.error("Error sending verification email", emailError)
        return { success: false, message: 'Failed to send verification email' }
    }
};