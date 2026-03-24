import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post('/register', async (req, res) => {
    console.log("enter in registering route...")
    try {
        const { username, email, password } = req.body;

        const isUserExisted = await User.findOne({ email });
        if (isUserExisted) {
            return res.status(409).json({
                message: 'User existed already, please create different account'
            })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const user = await User.create({
            username,
            email,
            password
        });

        const token = jwt.sign({ user: user._id }, process.env.JWT_SECRET_KEY,
            { expiresIn: '14d' }
        )

        res.cookie('jwt', token, {
            maxAge: 14 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV == "production",
        })

        const { password: pass, ...userData } = user.toObject();

        res.status(201).json({
            success: true,
            message: "User logged in successfully",
            user: userData,
            token
        });
    } catch (error) {
        return res.status(500).json({
            message: "internal server error",
            error: error.message
        })
    }
});

router.post('/login', async (req, res) => {
    try {
        console.log("request reached...")
        const { email, password } = req.body
        console.log(email,"password:", password)

        if (!email || !password) {
            return res.status(400).json({ message: 'all credential require' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "invalid email or password" })
        }

        const isPasswordCorrect = await user.matchPassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "invalid email or password" })
        }

        const token = jwt.sign({ user: user._id }, process.env.JWT_SECRET_KEY,
            { expiresIn: '14d' }
        );

        res.cookie('jwt', token, {
            maxAge: 14 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV == "production",
        });

        const { password: pass, ...userData } = user.toObject();

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: userData,
            token
        });

    } catch (error) {
        console.log("error in login controllers process", error)
        return res.status(500).json({
            message: "internal server error",
            error: error.message
        })
    }
});

router.post('/logout', (req, res) => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV == "production",
        });
        return res.status(200).json({ message: "User logout successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "internal server error",
            error: error.message
        })
    }
});

export default router;