const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");

const checkAuth = async (req, res, next) => {
    const token = req.cookies.token; // cookie must be enabled
    if (!token) {
        return res.status(401).json({ message: "Unauthorized, no token" });
    }

    try {
        const decoded = jwt.verify(token, "amitydv");
        const user = await UserModel.findById(decoded.ID);

        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user; // attach user to request
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = checkAuth;
