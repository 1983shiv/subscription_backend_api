import { Router } from "express";
import { createSubscription, getAllSubscriptions, getUserSubscriptions, getSubscription, cancelSubscription, getUpcomingRenewals } from "../controllers/subscription.controller.js";
import authorizeUser from "../middlewares/auth.middleware.js"

const subscriptionRouter = Router();



// Subscription CRUD operations
subscriptionRouter.get('/', authorizeUser, getAllSubscriptions);
subscriptionRouter.get('/upcoming', authorizeUser, getUpcomingRenewals); 
subscriptionRouter.get('/:id', authorizeUser, getSubscription);
subscriptionRouter.get('/user/:id', authorizeUser, getUserSubscriptions);



subscriptionRouter.post('/', authorizeUser, createSubscription);



// User specific subscription operations

subscriptionRouter.put('/:id/cancel', authorizeUser, cancelSubscription);


subscriptionRouter.put('/:id', (req, res) => res.send({ title: 'Update single subscription'}));
subscriptionRouter.delete('/:id', (req, res) => res.send({ title: 'Delete single subscription'}));

export default subscriptionRouter;