import { Router } from "express";

const subscriptionRouter = Router();

subscriptionRouter.get('/', (req, res) => res.send({ title: 'Get all subscriptions'}));
subscriptionRouter.get('/:id', (req, res) => res.send({ title: 'Get single subscription'}));

export default subscriptionRouter;