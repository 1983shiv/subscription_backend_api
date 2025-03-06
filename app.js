import express from 'express';
import cookieParser from 'cookie-parser';

import { PORT, NODE_ENV } from './config/env.js';

import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';

import connectToDatabase from './database/mongodb.js';

import arcjetMiddleware from './middlewares/arcjet.middleware.js';
import errorMiddleware from './middlewares/error.middleware.js';

import rateLimit from 'express-rate-limit';

// Rate-limiting middleware: limit to 100 requests per 15 minutes
const limiter = rateLimit({
    windowMs: 15 * 60 * 2, // 15 minutes
    max: 2, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(arcjetMiddleware);
app.use(limiter);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);

app.use(errorMiddleware);

app.get('/', (req, res) => {
    res.send('Welcome to the Subscription Tracker API');
})

app.listen(PORT, async() => {
    console.log(`Server is running on port http://localhost:${PORT} in ${NODE_ENV} mode`);
    await connectToDatabase();
})


export default app;