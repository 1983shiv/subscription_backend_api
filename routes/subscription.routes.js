import { Router } from "express";
import { createSubscription, getSubscriptions, getUserSubscriptions } from "../controllers/subscription.controller.js";
import authorizeUser from "../middlewares/auth.middleware.js"

const subscriptionRouter = Router();

// Subscription CRUD operations
subscriptionRouter.get('/', authorizeUser, getSubscriptions);
subscriptionRouter.get('/:id', (req, res) => res.send({ title: 'Get single subscription'}));
subscriptionRouter.post('/', authorizeUser, createSubscription);
subscriptionRouter.put('/:id', (req, res) => res.send({ title: 'Update single subscription'}));
subscriptionRouter.delete('/:id', (req, res) => res.send({ title: 'Delete single subscription'}));


// User specific subscription operations
subscriptionRouter.get('/user/:id', authorizeUser, getUserSubscriptions);
subscriptionRouter.put('/:id/cancel', (req, res) => res.send({ title: 'cancel the subscription'}))
subscriptionRouter.get('/upcoming-renewals', (req, res) => res.send({ title: 'Get all upcoming renewals'}));    

export default subscriptionRouter;