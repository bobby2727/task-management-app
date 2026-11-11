const jwt = require("jsonwebtoken")
const User = require("../models/User")

const protect = async(req, res, next)=>{
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer")){
            return res.status(401).json({
                message: "Not authorized. No token Provided."
            });
        }

        const token = authHeader.split(" ")[1];

        //verify token 

        const decode = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Find logged-in user

        const user = await User.findById(decode.id).select("-password");

        if(!user){
            return res.status(401).json({
                message:"User Not Found. Please login again"
            });
        }

        // Attach user to request
        req.user = user;

        next();
    }
    catch (error) {
    return res.status(401).json({
        message: "Invalid or expired token. Please login again."
    });
}
}

module.exports = protect;