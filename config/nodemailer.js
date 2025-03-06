import { EMAIL_USERNAME, EMAIL_PASSWORD } from './env.js'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD
    }
})