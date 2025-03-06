import mongoose from "mongoose"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js"

export const signUp = async(req, res, next) => {
    // session for mongoose transactions
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Logic to create new user
        // What is a req body? --> req.body is the data that is sent to the server from the client
        // What is a req object? --> req object is the request object that contains all the information about the request that the client has made to the server

        const { name, email, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if(existingUser){
            const error = new Error('User already exists');
            error.statusCode = 409;
            throw error;
        }

        // Hash the password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUsers = await User.create([{ name, email, password: hashedPassword}], { session});
        const token = jwt.sign({ email: newUsers[0].email, id: newUsers[0]._id}, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN});
        
        await session.commitTransaction();
        await session.endSession()

        // res.cookie('token', token, { httpOnly: true, maxAge: 3600000});
        res.status(201).json({ 
            success: true, 
            message: 'New user created successfully', 
            data: { token, user: newUsers[0]}    
        });
    } catch (error) {
        console.log(error.message)
        if (session && typeof session.abortTransaction === 'function') {
            await session.abortTransaction();
        }
        session.endSession();
        next(error);
    } 


}


export const signIn = async(req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if(!user){
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        // validate the password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if(!isValidPassword){
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            throw error;
        }

        // if valid, generate token
        const token = jwt.sign({ email: user.email, id: user._id}, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN});

        res.status(200).json({ 
            success: true, 
            message: 'User signed in successfully', 
            data: { token, user}    
        });
    } catch (error) {
        next(error);
    }
}

export const signOut = async(req, res, next) => {}