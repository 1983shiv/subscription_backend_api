import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "subsciption_name is required"],
        trim: true,
        minLength: [2, "subsciption_name must be at least 2 characters long"],
        maxLength: [100, "subsciption_name must be at most 100 characters long"]
    },
    price: {
        type: Number,
        required: [true, "price is required"],
        min: [0, "price must be at least 0"]
    },
    currency: {
        type: String,
        enum: ["USD", "EUR", "GBP", "INR"],
        default: "INR"
    },
    frequency: {
        type: String,
        enum: ["daily", "weekly", "monthly", "yearly"],
        default: "monthly"
    },
    category: {
        type: String,
        enum: ["entertainment", "education", "health", "finance", "food", "other"],
        default: "education",
        required: [true, "category is required"]
    },
    paymentMethod: {
        type: String,
        trim: true,
        required: [true, "paymentMethod is required"],
        enum: ["credit_card", "debit_card", "netbanking", "upi", "paypal", "other"],
    },
    status: {
        type: String,
        enum: ["active", "cancelled", "expired", "trial"],
        default: "active"
    },
    startDate: {
        type: Date,
        required: [true, "startDate is required"],
        validate: {
            validator: (value) => value < new Date(),
            message: "startDate must be a past date from now"
        },
    },
    renewalDate: {
        type: Date,
        validate: {
            validator: function (value) {
                return value > this.startDate;
            },
            message: "renewalDate must be a after from startDate"
        },
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    }
}, { timestamps: true });


// auto calculate renewalDate if missing
subscriptionSchema.pre("save", function (next){
    if(!this.renewalDate){
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365
        }
        const renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }

    // auto update the status if renewalDate is in the past
    if(this.renewalDate < new Date()){
        this.status = "expired";
    }

    next();
})

export default mongoose.model("Subscription", subscriptionSchema);