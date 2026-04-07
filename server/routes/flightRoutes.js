import express from "express";
const Router = express.Router()
import { addFlight, deleteFlight, fetchBookings, fetchFlight, fetchFlightById, updateFlight } from "../controllers/flightController.js";

Router.post('/add-flight',addFlight)
Router.put('/update-flight',updateFlight)
Router.get('/fetch-flights',fetchFlight)
Router.get('/fetch-flight/:id',fetchFlightById)
Router.delete('/delete-flight/:id', deleteFlight)

export default Router
