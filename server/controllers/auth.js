const jwt = require("jsonwebtoken")
const Admin = require("../models/admin")
const bcrypt = require("bcrypt")
require("dotenv").config()


exports.signup = async (req, res) => {
    try {
        let { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "email & password required"
            })
        }
        // Normalize email
        email = email.trim().toLowerCase();

        const userExists = await Admin.findOne({ email })

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User exists, Please login"
            })
        }

        const newUser = new Admin({
            email,
            password
        })
        await newUser.save()

        if (newUser) {
            const token = jwt.sign(
                { id: newUser._id, email: newUser.email },
                process.env.JWT_SECRET,
                { expiresIn: "24h" }
            );
            const user = newUser.toObject();
            delete user.password;
            user.profileImage = `https://api.dicebear.com/5.x/initials/svg?seed=${email.split("@")[0]}`
            return res.status(200).json({
                success: true,
                message: "Signup successful",
                token,
                user
            })
        } else {
            return res.status(400).json({
                success: false,
                message: "Error creating user, Try again"
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })

    }
}

exports.login = async (req, res) => {
    try {
        let { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "email & password required"
            })
        }
        // Normalize email
        email = email.trim().toLowerCase();

        const user = await Admin.findOne({ email })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        if (await bcrypt.compare(password, user.password)) {



            const jwtPayload = {
                _id: user._id,
                email: user.email
            }
            const expiresIn = "24h"; // 24 hours in seconds
            const token = jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn })

            const userData = user.toObject();
            const name = email.split("@")[0]
            userData.profileImage = `https://api.dicebear.com/5.x/initials/svg?seed=${name}`
            delete userData.password

            return res.status(200).json({
                success: true,
                message: "Login successful",
                user: userData,
                token
            })
        } else {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
}