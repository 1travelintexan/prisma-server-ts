"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// ℹ️ Handles password encryption
// const bcrypt = require("bcrypt");
const bcrypt_1 = __importDefault(require("bcrypt"));
// ℹ️ Handles password encryption
// const jwt = require("jsonwebtoken");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Require the User model in order to interact with the database
// const User = require("../models/User.model");
// import User from "../models/User.model";
//************************************* */
// Require necessary (isAuthenticated) middleware in order to control access to specific routes
// const { isAuthenticated } = require("../middleware/jwt.middleware.js");
// import { isAuthenticated } from '../middleware/jwt.middleware.js';
// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;
const jwt_middleware_1 = require("../middleware/jwt.middleware");
//**************PRISMA ********************/
const prisma = require("../db/index.ts");
// POST /auth/signup  - Creates a new user in the database
router.post("/signup", (req, res) => {
    const { password } = req.body;
    // If email is unique, proceed to hash the password
    const salt = bcrypt_1.default.genSaltSync(saltRounds);
    const hashedPassword = bcrypt_1.default.hashSync(password, salt);
    // Create the new user in the database
    prisma.user
        .create({ data: Object.assign(Object.assign({}, req.body), { password: hashedPassword }) })
        .then((response) => {
        res.status(201).json({ newUser: response });
    })
        .catch((err) => {
        console.log(err);
        res.status(501).json({ message: "nope", err });
    });
});
// POST  /auth/login - Verifies email and password and returns a JWT
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // Check if email or password are provided as empty string
    if (email === "" || password === "") {
        res.status(400).json({ message: "Provide email and password." });
        return;
    }
    try {
        // Check the users collection if a user with the same email exists
        const foundUser = yield prisma.user.findFirst({
            where: { email: req.body.email },
        });
        console.log("user found", foundUser);
        // Compare the provided password with the one saved in the database
        const passwordCorrect = bcrypt_1.default.compareSync(password, foundUser.password);
        if (passwordCorrect) {
            // Deconstruct the user object to omit the password
            const { id, email, name } = foundUser;
            // Create an object that will be set as the token payload
            const payload = { id, name, email };
            // Create a JSON Web Token and sign it
            const authToken = jsonwebtoken_1.default.sign(payload, process.env.TOKEN_SECRET, {
                algorithm: "HS256",
                expiresIn: "6h",
            });
            // Send the token as the response
            res.status(200).json({ authToken: authToken });
        }
        else {
            res.status(401).json({ message: "Unable to authenticate the user" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
}));
//find one user with the token
router.get("/one-user", jwt_middleware_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("here is the payload", req.payload);
    try {
        const foundOneUser = yield prisma.user.findFirst({
            where: { id: Number(req.payload.id) },
        });
        // console.log("here is the single user", foundOneUser);
        res.status(200).json(foundOneUser);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
}));
//update user with token
router.put("/update-user", jwt_middleware_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield prisma.user.update({
            where: { id: req.payload.id },
            data: req.body,
        });
        console.log("user updated successfully", updatedUser);
        res.status(200).json(updatedUser);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
}));
//delete user with token
router.delete("/delete-user", jwt_middleware_1.isAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedUser = yield prisma.user.delete({
            where: { id: req.payload.id },
        });
        console.log("user updated successfully", deletedUser);
        res.status(200).json(deletedUser);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
}));
// GET  /auth/verify  -  Used to verify JWT stored on the client
router.get("/verify", jwt_middleware_1.isAuthenticated, (req, res) => {
    // If JWT token is valid the payload gets decoded by the
    // isAuthenticated middleware and is made available on `req.payload`
    console.log(`req.payload`, req.payload);
    // Send back the token payload object containing the user data
    res.status(200).json(req.payload);
});
module.exports = router;
