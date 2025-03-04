import express from 'express';
import { PORT, NODE_ENV } from './config/env.js';

const app = express();

app.get('/', (req, res) => {
    res.send('Welcome to the Subscription Tracker API');
})

app.listen(3000, () => {
    console.log(`Server is running on port http://localhost:${PORT} in ${NODE_ENV} mode`);
})

export default app;