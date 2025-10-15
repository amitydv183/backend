const UserModel = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class userController {
    // ✅ Register User
    static create = async (req, res) => {
        try {
            const { name, email, password, role } = req.body;

            // check if email already exists
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "Email already exists, use another" });
            }

            // hash password
            const hashPassword = await bcrypt.hash(password, 10);

            // create user (role defaults to "user")
            const data = await UserModel.create({
                name,
                email,
                password: hashPassword,
                role: role || "user"
            });

            res.status(201).json({
                message: "User created successfully",
                user: { id: data._id, name: data.name, email: data.email, role: data.role }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    };

    // ✅ Login User
    static login = async (req, res) => {
        try {
            const { email, password } = req.body;

            // check email
            const checkEmail = await UserModel.findOne({ email });
            if (!checkEmail) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            // check password
            const checkPassword = await bcrypt.compare(password, checkEmail.password);
            if (!checkPassword) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            // generate token
            const token = jwt.sign({ ID: checkEmail._id }, "amitydv", { expiresIn: "1d" });

            // set cookie
            res.cookie("token", token, {
                httpOnly: true,
                secure: false, // set true if using https
                sameSite: "strict"
            });

            res.status(200).json({
                message: "Login successful",
                user: {
                    id: checkEmail._id,
                    name: checkEmail.name,
                    email: checkEmail.email,
                    role: checkEmail.role
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    };

    // ✅ Logout User
    static logout = async (req, res) => {
        try {
            res.clearCookie("token");
            res.status(200).json({ message: "Logout successful" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    };
}

module.exports = userController;
