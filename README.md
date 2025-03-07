# 👋 Hi, I’m Shiv Srivastava

### A Full-Stack Developer from India
<h3 align="center"><a href="https://twitter.com/const_shiv" ><img src="https://img.shields.io/twitter/follow/const_shiv.svg?style=social" /> </a></h3>

---

## Overview

This project is a **Backend API** for a **Subscription Model** with **authentication**.

### Tech Stack:
- **Node.js**
- **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** (JSON Web Tokens) for authentication
- **MVC** (Model-View-Controller) design pattern
- **Middleware** for authentication and authorization

---

## Setup Instructions

To get started with this project, follow the steps below:

1. **Clone the repository** to your computer:
   ```bash
   git clone https://github.com/1983shiv/subscription_backend_api.git

    cd subscription_backend_api
    npm install
    npm dev
    ```

API RoutesBelow is a list of all the available API routes, organized by their function. All the routes in the application use JWT-based authentication and authorization through middleware.Authentication Routes (authRouter)POST /api/v1/auth/sign-up - Sign up a new userPOST /api/v1/auth/sign-in - Sign in an existing userPOST /api/v1/auth/sign-out - Sign out the current userUser Routes (userRouter)GET /api/v1/users/ - Get a list of all users (authorized)GET /api/v1/users/:id - Get a specific user's details (authorized)POST /api/v1/users/ - Create a new user (admin route)PUT /api/v1/users/:id - Update a specific user's details (admin route)DELETE /api/v1/users/:id - Delete a user (admin route)Subscription Routes (subscriptionRouter)CRUD operations for subscriptions:GET /api/v1/subscriptions/ - Get all subscriptions for the authenticated user (authorized)GET /api/v1/subscriptions/upcoming-renewal - Get all upcoming renewal subscriptions for the authenticated user (authorized)GET /api/v1/subscriptions/:id - Get a specific subscription by ID (authorized)GET /api/v1/subscriptions/user/:id - Get all subscriptions for a specific user (authorized)POST /api/v1/subscriptions/ - Create a new subscription for the authenticated user (authorized)Subscription management routes:PUT /api/v1/subscriptions/:id/cancel - Cancel a specific subscription (authorized)PUT /api/v1/subscriptions/:id/renew - Renew a specific subscription (authorized)PUT /api/v1/subscriptions/:id/change-plan - Change the subscription plan (e.g., upgrading or downgrading).Other routes:PUT /api/v1/subscriptions/:id/update-details - Update the details of a subscription (name, payment method, etc.)PUT /api/v1/subscriptions/:id - Update a subscription (can be customized for further updates)DELETE /api/v1/subscriptions/:id - Delete a specific subscription (authorized)Controllers and FunctionsEach route is associated with a corresponding controller function. Here’s an overview of the key controller functions used in the routes:Authentication ControllersignUp(req, res, next): Handles user registration and creates a new user in the database.signIn(req, res, next): Handles user login, generates a JWT token, and authenticates the user.signOut(req, res, next): Handles user logout by invalidating the current JWT token.User ControllergetUsers(req, res, next): Fetches a list of all users from the database (for admin).getUser(req, res, next): Fetches a specific user's details by user ID.updateUser(req, res, next): Updates a specific user's details by user ID.deleteUser(req, res, next): Deletes a specific user from the database.Subscription ControllergetAllSubscriptions(req, res, next): Fetches all subscriptions associated with the authenticated user.getUpcomingRenewals(req, res, next): Fetches all subscriptions that are due for renewal.getSubscription(req, res, next): Fetches a specific subscription by ID for the authenticated user.getUserSubscriptions(req, res, next): Fetches all subscriptions for a specific user.createSubscription(req, res, next): Creates a new subscription for the authenticated user.cancelSubscription(req, res, next): Cancels a specific subscription.renewSubscription(req, res, next): Renews a specific subscription, extending its renewal date.changeSubscriptionPlan(req, res, next): Changes the subscription plan (e.g., upgrading or downgrading).updateSubscriptionDetails(req, res, next): Updates details like payment method, frequency, etc., for an existing subscription.MiddlewareAuthentication Middleware (authorizeUser)This middleware checks if the user is authenticated. It verifies the JWT token sent in the request headers and ensures that the user is authorized to access the requested resource.Error Handling MiddlewareIf an error occurs during any operation (e.g., validation errors, MongoDB errors, etc.), the error-handling middleware catches the error and sends an appropriate response to the client.Running the Application LocallyRequirements:Node.js: Version 14 or higherMongoDB: Running locally or use a cloud database service like MongoDB Atlas.Future EnhancementsRate Limiting: Implement rate-limiting middleware to prevent abuse.Email Notifications: Integrate with email services to send renewal and cancellation notifications.Payment Integration: Integrate with a payment gateway (like Stripe) to handle subscriptions and payments.    
