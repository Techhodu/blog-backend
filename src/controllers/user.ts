import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import { newUserRequstBody, myParams } from "../types/types";
import ErrorHandler from "../utils/utility-class";
import { TryCatch } from "../middlewares/error";

export const newUser = TryCatch(
  async (
    req: Request<any, {}, newUserRequstBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, email, photo, role, dob, gender, _id ,description} = req.body;

    let user = await User.findById(_id);
    if (user) {
      res.status(200).json({
        success: true,
        message: `Welcome back ${user.name}`,
        status: 200,
      });
    }
    if (!_id || !name || !email || !photo || !dob || !gender) {
      next(new ErrorHandler("Please add all fileds", 400));
    }

    user = await User.create({
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
  }
);

export const getAllUsers = TryCatch(async (req, res, next) => {
  const users = await User.find({});

  return res.status(200).json({
    success: true,
    users,
  });
});

export const getUser = TryCatch(async (req, res, next) => {
  const id: string = req.params.id;

  const user = await User.findById(id);

  if (!user) return next(new ErrorHandler("Invalid User id", 400));

  return res.status(200).json({
    success: true,
    user,
  });
});
export const deleteUser = TryCatch(async (req, res, next) => {
  const id: string = req.params.id;
  const user = await User.findById(id);
  if (!user) return next(new ErrorHandler("Invalid User id", 400));
  await user.deleteOne();
  return res.status(200).json({
    success: true,
    message: "User Deleted Succesfully",
  });
});
