import { Login,Register } from "../controllers/authController.js";
import express from "express"
const Router = express.Router()

Router.post("/register",Register)
Router.post("/login",Login)

export default Router