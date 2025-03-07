import { JWT_SECRET } from "../config/env.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


const authorizeUser = async (req, res, next) => {
    try {
        let token;

        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];
        }
        // console.log({token})
        if(!token){
            res.status(401).json({ message: "Unauthorized"});
        }

        // if token exists, verify it
        const decoded = jwt.verify(token, JWT_SECRET);
        // console.log({decoded})
        const user = await User.findById(decoded.id);

        if(!user){
            res.status(401).json({ message: "Unauthorized, User not found"});
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ messaeg: "Unauthorized", error: error.messaeg})
    }
}

export default authorizeUser;