import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";

export const signup = async (req, res) => {
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
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(200).json({ message: "Username is already exist" });
    } else {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        res.status(200).json({ message: "Email is already exist" });
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
          .json({ message: "Signup has been successfully completed" });
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
