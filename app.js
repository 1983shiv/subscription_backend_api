import express from 'express';
import { PORT, NODE_ENV } from './config/env.js';

import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';

import connectToDatabase from './database/mongodb.js';

const app = express();

app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/subscriptions', subscriptionRouter);

app.get('/', (req, res) => {
    res.send('Welcome to the Subscription Tracker API');
})

app.listen(PORT, async() => {
    console.log(`Server is running on port http://localhost:${PORT} in ${NODE_ENV} mode`);
    await connectToDatabase();
})


export default app;