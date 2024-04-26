import express from "express";
import { updateUser } from "../controllers/user.controller.js";
const router = express.Router();
import {verifyToken} from '../utils/verifyUser.js'


router.put("/update/:userId", verifyToken, updateUser);


export default router;