"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getUser = exports.getAllUsers = exports.newUser = void 0;
const User_1 = require("../models/User");
const utility_class_1 = __importDefault(require("../utils/utility-class"));
const error_1 = require("../middlewares/error");
exports.newUser = (0, error_1.TryCatch)(async (req, res, next) => {
    const { name, email, photo, role, dob, gender, _id, description } = req.body;
    let user = await User_1.User.findById(_id);
    if (user) {
        res.status(200).json({
            success: true,
            message: `Welcome back ${user.name}`,
            status: 200,
        });
    }
    if (!_id || !name || !email || !photo || !dob || !gender) {
        next(new utility_class_1.default("Please add all fileds", 400));
    }
    user = await User_1.User.create({
        name,
        email,
        photo,
        // role,
        dob: new Date(dob),
        gender,
        description,
        _id,
    });
    return res.status(201).json({
        success: true,
        message: `Welcome ${user.name}`,
    });
});
exports.getAllUsers = (0, error_1.TryCatch)(async (req, res, next) => {
    const users = await User_1.User.find({});
    return res.status(200).json({
        success: true,
        users,
    });
});
exports.getUser = (0, error_1.TryCatch)(async (req, res, next) => {
    const id = req.params.id;
    const user = await User_1.User.findById(id);
    if (!user)
        return next(new utility_class_1.default("Invalid User id", 400));
    return res.status(200).json({
        success: true,
        user,
    });
});
exports.deleteUser = (0, error_1.TryCatch)(async (req, res, next) => {
    const id = req.params.id;
    const user = await User_1.User.findById(id);
    if (!user)
        return next(new utility_class_1.default("Invalid User id", 400));
    await user.deleteOne();
    return res.status(200).json({
        success: true,
        message: "User Deleted Succesfully",
    });
});
