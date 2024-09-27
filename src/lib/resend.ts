import { Resend } from 'resend';
// const RESEND_API_KEY = process.env.RESEND_API_KEY || ''

export const resend = new Resend(process.env.RESEND_API_KEY);
// export const resend = new Resend('re_jQMBViq1_BURozARhqYgz8uZVFHHsKzbm')