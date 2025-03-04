import { Router } from "express";

const subscriptionRouter = Router();

// Subscription CRUD operations
subscriptionRouter.get('/', (req, res) => res.send({ title: 'Get all subscriptions'}));
subscriptionRouter.get('/:id', (req, res) => res.send({ title: 'Get single subscription'}));
subscriptionRouter.post('/', (req, res) => res.send({ title: 'Create subscription'}));
subscriptionRouter.put('/:id', (req, res) => res.send({ title: 'Update single subscription'}));
subscriptionRouter.delete('/:id', (req, res) => res.send({ title: 'Delete single subscription'}));


// User specific subscription operations
subscriptionRouter.get('/user/:id', (req, res) => res.send({ title: 'Get all subscriptions for a user'}));
subscriptionRouter.put('/:id/cancel', (req, res) => res.send({ title: 'cancel the subscription'}))


export default subscriptionRouter;