import { Approve, DeleteUser, fetchAllUsers, fetchUser, Reject } from "../controllers/adminController.js";
import express from "express";
const Router = express.Router()

Router.post('/approve-operator', Approve)
Router.post('/reject-operator', Reject)
Router.get('/fetch-user/:id', fetchUser)
Router.get('/fetch-users', fetchAllUsers)
Router.delete('/delete-user/:id', DeleteUser)

export default Router