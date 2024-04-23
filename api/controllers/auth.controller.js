import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import {errorHandler} from '../utils/error.js'

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
      res.status(200).json({ success: false, message: "Username is already exist" });
    } else {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        res.status(200).json({ success: false, message: "Email is already exist" });
      } else {
        const hashedPassword = bcryptjs.hashSync(password, 10);
        const newUser = new User({
          username,
          email,
          password: hashedPassword,
        });

        await newUser.save();
        res
          .status(200)
          .json({ success: true, message: "Signup has been successfully completed" });
      }
    }
  } catch (error) {
    next(error)
  }
};
