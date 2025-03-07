import { EMAIL_USERNAME, EMAIL_PASSWORD } from './env.js'
import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD
    }
})