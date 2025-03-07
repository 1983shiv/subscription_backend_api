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



