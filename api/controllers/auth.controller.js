import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (
      !username ||
      !email ||
      !password ||
      username === "" ||
      email === "" ||
      password === ""
    ) {
      return next(errorHandler(400, "All fields are required"));
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res
        .status(200)
        .json({ success: false, message: "Username is already exist" });
    } else {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        res
          .status(200)
          .json({ success: false, message: "Email is already exist" });
      } else {
        const hashedPassword = bcryptjs.hashSync(password, 10);
        const newUser = new User({
          username,
          email,
          password: hashedPassword,
        });

        await newUser.save();
        res.status(200).json({
          success: true,
          message: "Signup has been successfully completed",
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

//Sign in function
export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password || email === "" || password === "") {
      return next(errorHandler(400, "All fields are required"));
    }

    const validUser = await User.findOne(
      { email },
      { _id: 1, username: 1, email: 1, password: 1 }
    );

    if (!validUser)
      return next(errorHandler(404, "Email is not registered yet"));

    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validPassword)
      return next(errorHandler(401, "Invalid login credentials"));

    const { password: hashedPassword, ...rest } = validUser._doc;
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const expiryDate = new Date(Date.now() + 3600000); //1 Hour

    res
      .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

//Google login
export const google = async (req, res, next) => {
  try {
    const { name, email, photo } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: hashedPassword, ...rest } = user._doc;
      const expiryDate = new Date(Date.now() + 3600000); //1 Hour
      res
        .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          name.split(" ").join("").toLowerCase() +
          Math.floor(Math.random() * 10000).toString(),
        email,
        password: hashedPassword,
        profilePicture: photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: hashedPassword1, ...rest } = newUser._doc;
      const expiryDate = new Date(Date.now() + 3600000); //1 Hour
      res
        .cookie("access_token", token, { httpOnly: true, expires: expiryDate })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
