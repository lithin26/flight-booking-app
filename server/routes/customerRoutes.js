import express from "express";

const Router = express.Router();
import { bookTicket, cancelTicket,fetchBookings } from "../controllers/customerController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

Router.post('/book-ticket', verifyToken, bookTicket);
Router.put('/cancel-ticket/:id', verifyToken, cancelTicket);
Router.get('/fetch-bookings', fetchBookings);

export default Router;
