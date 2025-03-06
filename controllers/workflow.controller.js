import dayjs from 'dayjs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { serve } = require('@upstash/workflow/express');

import Subscription from '../models/subscription.model.js';

const REMINDERS = [7, 5, 2, 1];

export const sendReminders = serve(async (context) => {
    // const { subscriptionId } = context.data;
    const { subscriptionId } = context.requestPayload;
    const subscription = await fetchSubscription(context, subscriptionId);

    if (!subscription || subscription.status !== 'active') {
        return;
    }

    const renewalDate = dayjs(subscription.renewalDate);

    if (renewalDate.isBefore(dayjs())) {
        console.log(
            `Renewal Date has passed for subscription ${subscriptionId}, hence stopping workflow.`
        );
        return;
    }

    for (const daysBefore of REMINDERS) {
        const reminderDate = renewalDate.subtract(daysBefore, 'day');

        if (reminderDate.isAfter(dayjs())) {
            await sleepUntilReminder(
                context,
                `Reminder ${daysBefore} days before`,
                reminderDate
            );
        }
        // if(dayjs().isSame(reminderDate, 'day')){
        //     console.log(`Sending reminder for subscription ${subscriptionId} on ${reminderDate}`);
        //     // await sendReminderEmail(context, subscription, reminderDate);
        // }

        await triggerReminder(context, `Reminder ${daysBefore} days before`);
    }
});

const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription', async () => {
        return Subscription.findById(subscriptionId).populate({
            path: 'user',
            select: 'name email',
        });
    });
};

const sleepUntilReminder = async (context, label, date) => {
    console.log(`Sleeping until ${label} reminder at ${date}`);
    await context.sleepUntil(label, date.toDate());
};

const triggerReminder = async (context, label) => {
    return await context.run(label, () => {
        console.log(`Triggering ${label} reminder`);
        // send Email, SMS, Push notification etc.
    });
};
