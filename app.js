import express from 'express';
import { PORT, NODE_ENV } from './config/env.js';

import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';

const app = express();

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);

app.get('/', (req, res) => {
    res.send('Welcome to the Subscription Tracker API');
})

app.listen(3000, () => {
    console.log(`Server is running on port http://localhost:${PORT} in ${NODE_ENV} mode`);
})

export default app;