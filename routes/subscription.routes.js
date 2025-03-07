import { Router } from "express";
import { createSubscription, getAllSubscriptions, getUserSubscriptions, getSubscription, cancelSubscription, getUpcomingRenewals, changeSubscriptionPlan, renewSubscription } from "../controllers/subscription.controller.js";
import authorizeUser from "../middlewares/auth.middleware.js"

const subscriptionRouter = Router();



// Subscription CRUD operations
subscriptionRouter.get('/', authorizeUser, getAllSubscriptions);
subscriptionRouter.get('/upcoming-renewal', authorizeUser, getUpcomingRenewals); 
subscriptionRouter.get('/:id', authorizeUser, getSubscription);
subscriptionRouter.get('/user/:id', authorizeUser, getUserSubscriptions);



subscriptionRouter.post('/', authorizeUser, createSubscription);



// User specific subscription operations

subscriptionRouter.put('/:id/cancel', authorizeUser, cancelSubscription);
subscriptionRouter.put('/:id/renew', authorizeUser, renewSubscription);

// update the user subscription details like name, payment method etc.
// subscriptionRouter.put('/:id/update-details', authorizeUser, updateSubscriptionDetails);
subscriptionRouter.put('/:id/change-plan', authorizeUser, changeSubscriptionPlan);
subscriptionRouter.put('/:id', (req, res) => res.send({ title: 'Update single subscription'}));
subscriptionRouter.delete('/:id', (req, res) => res.send({ title: 'Delete single subscription'}));

export default subscriptionRouter;