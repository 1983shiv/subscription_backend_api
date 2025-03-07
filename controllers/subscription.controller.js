import { workflowClient } from "../config/upstash.js"
import Subscription from "../models/subscription.model.js";
import { SERVER_URL } from "../config/env.js"
import dayjs from "dayjs";

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id
        });

        const { workflowRunId } = await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                subscriptionId: subscription.id
            },
            headers: {
                'content-type': 'application/json'
            },
            retries: 0,
        })
        res.status(201).json({success: true, data: {subscription, workflowRunId}});
    } catch (error) {
        next(error)
    }
}

export const getUserSubscriptions = async (req, res, next) => {
    try {
        // console.log({user: req.user, params: req.params})
        if(req.user.id !== req.params.id){
            const error = new Error("You are not the owner of this subscription");
            error.statusCode = 401;
            throw error;
        }
        // const subscriptions = await Subscription.find({user: req.user._id});
        const subscriptions = await Subscription.find({user: req.params.id});

        res.status(201).json({success: true, data: subscriptions});
    } catch (error) {
        next(error)
    }
}

export const getAllSubscriptions = async (req, res, next) => {
    try {
        // console.log({user: req.user, params: req.params})
        const subscriptions = await Subscription.find();

        res.status(201).json({success: true, data: subscriptions});
    } catch (error) {
        next(error)
    }
}

export const getSubscription = async (req, res, next) => {
    try {
        console.log({user: req.user, params: req.params});
        const subscriptions = await Subscription.find({_id: req.params.id});
        res.status(201).json({success: true, data: subscriptions[0]});
    } catch (error) {
        next(error)
    }
}

export const cancelSubscription = async (req, res, next) => {
    try {
        // Ensure the user is trying to cancel their own subscription
        const subscription = await Subscription.findById(req.params.id);

        // If subscription doesn't exist
        if (!subscription) {
            const error = new Error("Subscription not found");
            error.statusCode = 404;
            throw error;
        }

        if (subscription.status === "expired") {
            const error = new Error("Subscription has already expired.");
            error.statusCode = 404;
            throw error;
        }

        if (subscription.status === "cancelled") {
            const error = new Error("Subscription has already cancelled");
            error.statusCode = 404;
            throw error;
        }

        // Check if the logged-in user is the owner of the subscription
        if (subscription.user.toString() !== req.user._id.toString()) {
            const error = new Error("You are not authorized to cancel this subscription");
            error.statusCode = 401;
            throw error;
        }

        // Update the subscription's status to "cancelled"
        subscription.status = "cancelled";
        await subscription.save();

        // Optionally, if you want to handle any post-cancellation actions (e.g., workflow, emails), add them here
        // sending an email to the user for subscription cancellation
        res.status(200).json({
            success: true,
            message: "Subscription has been successfully cancelled",
            data: subscription
        });
    } catch (error) {
        next(error);
    }
};

export const getUpcomingRenewals = async (req, res, next) => {
    console.log("getUpcomingRenewals");
    try {
        // Get the current date
        const currentDate = new Date();
        console.log({currentDate});
        // Fetch all subscriptions where the renewalDate is greater than the current date
        const upcomingRenewals = await Subscription.find({
            renewalDate: { $gt: currentDate },  // $gt stands for "greater than"
            status: "active"                    // Ensure that the subscription is active
        });
        console.log({upcomingRenewals})
        // If no upcoming renewals are found, return a message
        if (upcomingRenewals.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No upcoming renewals found."
            });
        }

        // Send the list of upcoming renewals
        res.status(200).json({
            success: true,
            data: upcomingRenewals
        });
    } catch (error) {
        next(error);
    }
};

export const renewSubscription = async (req, res, next) => {
    try {
        // Get subscription ID from URL params
        const subscriptionId = req.params.id;

        // Find the subscription by ID
        const subscription = await Subscription.findById(subscriptionId);

        if (!subscription) {
            const error = new Error("Subscription not found");
            error.statusCode = 404;
            throw error;
        }

        // Check if the subscription is expired
        if (subscription.status === "trial") {
            const error = new Error("Cannot renew an trial subscription");
            error.statusCode = 400;
            throw error;
        }

        // Calculate the new renewal date based on the current date
        let newRenewalDate;
        const currentDate = new Date();
        const currentRenewalDate = subscription.renewalDate;
        // If the user is renewing before the current renewal date
        if (subscription.renewalDate > currentDate) {
            // Renew the subscription from the current date (as they are renewing early)
            switch (subscription.frequency) {
                case "daily":
                    // Add 1 day to the current renewal date
                    newRenewalDate = new Date(currentRenewalDate.setDate(currentRenewalDate.getDate() + 1));
                    break;
                case "weekly":
                    // Add 7 days to the current renewal date
                    newRenewalDate = new Date(currentRenewalDate.setDate(currentRenewalDate.getDate() + 7));
                    break;
                case "monthly":
                    // Add 1 month to the current renewal date
                    newRenewalDate = new Date(currentRenewalDate.setMonth(currentRenewalDate.getMonth() + 1));
                    break;
                case "yearly":
                    // Add 1 year to the current renewal date
                    newRenewalDate = new Date(currentRenewalDate.setFullYear(currentRenewalDate.getFullYear() + 1));
                    break;
                default:
                    newRenewalDate = currentRenewalDate; // Default case if no frequency is set (you can modify this based on your logic)
                    break;
            }
        } else {
            // If the renewal date has already passed, use the current date for renewal
            switch (subscription.frequency) {
                case "daily":
                    newRenewalDate = new Date(currentDate.setDate(currentDate.getDate() + 1)); // Add 1 day
                    break;
                case "weekly":
                    newRenewalDate = new Date(currentDate.setDate(currentDate.getDate() + 7)); // Add 7 days
                    break;
                case "monthly":
                    newRenewalDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1)); // Add 1 month
                    break;
                case "yearly":
                    newRenewalDate = new Date(currentDate.setFullYear(currentDate.getFullYear() + 1)); // Add 1 year
                    break;
                default:
                    newRenewalDate = currentDate; // If no frequency is set, renew immediately
                    break;
            }
        }

        // Update the subscription's renewal date and status (optional)
        subscription.renewalDate = newRenewalDate;
        subscription.status = "active"; // Optionally, set the status to 'active' if it was 'expired'

        // Save the updated subscription
        await subscription.save();

        // Respond with the updated subscription
        res.status(200).json({
            success: true,
            message: "Subscription renewed successfully",
            data: subscription
        });
    } catch (error) {
        next(error);
    }
};


export const changeSubscriptionPlan = async (req, res, next) => {
    try {
        const subscriptionId = req.params.id;
        const { newPlan } = req.body;

        const subscription = await Subscription.findById(subscriptionId);

        if (!subscription) {
            const error = new Error("Subscription not found");
            error.statusCode = 404;
            throw error;
        }

        subscription.plan = newPlan;  // Change the subscription plan
        await subscription.save();

        res.status(200).json({
            success: true,
            message: "Subscription plan changed successfully",
            data: subscription
        });
    } catch (error) {
        next(error);
    }
};






