const express = require("express");
const router = express.Router();
const User = require("../models/User");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
require("dotenv").config();
const { auth } = require("../middleware");

const signupSchema = zod.object({
    firstName: zod.string(),
    lastName: zod.string(),
    username: zod.string().email(),
    password: zod.string()
});

// 1. signup
router.post("/signup", async (req, res) => {
    const body = req.body;
    const { success } = signupSchema.safeParse(body);
    if (!success) {
        return res.status(411).json({
            message: "Invalid data provided."
        });
    }

    const existingUser = await User.findOne({
        username: body.username
    });
    if (existingUser) {
        return res.status(411).json({
            message: "Username already exists."
        });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);

    const user = await User.create({
        username: body.username,
        password: hashedPassword, // store the hashed password
        firstName: body.firstName,
        lastName: body.lastName
    });

    res.status(201).json({
        message: "User created successfully.",
        user
    });
});

// 2. get all users
router.get("/getusers", auth, async (req, res) => {
    const users = await User.find();
    res.status(200).json({
        users
    });
});

// 3. login user
const signinSchema = zod.object({
    username: zod.string().email(),
    password: zod.string()
});

router.post("/signin", async (req, res) => {
    const { success } = signinSchema.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs."
        });
    }

    const user = await User.findOne({
        username: req.body.username
    });

    if (!user) {
        return res.status(411).json({
            message: "Invalid username or password."
        });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

    if (!isPasswordValid) {
        return res.status(411).json({
            message: "Invalid username or password."
        });
    }

    const token = jwt.sign({
        userId: user._id
    }, process.env.JWT_SECRET);

    res.status(200).json({
        user: user,
        token: token
    });
});

module.exports = router;
