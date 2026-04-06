import { Flight } from '../models/flightSchema.js';
import { Booking } from '../models/bookingSchema.js';

export const addFlight = async (req, res) => {
    const { flightName, flightId, origin, destination, departureTime, arrivalTime, basePrice, totalSeats, adminId } = req.body;
    try {
      const flight = new Flight({
        flightName,
        flightId,
        origin,
        destination,
        departureTime,
        arrivalTime,
        basePrice,
        totalSeats,
        availableSeats: totalSeats,
        adminId
      });
    await flight.save();
    res.json({ message: 'flight added' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error adding flight', error: err.message });
  }
};

export const updateFlight = async (req, res) => {
  const { _id, flightName, flightId, origin, destination, departureTime, arrivalTime, basePrice, totalSeats } = req.body;
  try {
    const flight = await Flight.findById(_id);

    if (!flight) return res.status(404).json({ message: 'Flight not found' });

    const seatDiff = totalSeats - flight.totalSeats;

    flight.flightName = flightName;
    flight.flightId = flightId;
    flight.origin = origin;
    flight.destination = destination;
    flight.departureTime = departureTime;
    flight.arrivalTime = arrivalTime;
    flight.basePrice = basePrice;
    flight.totalSeats = totalSeats;
    flight.availableSeats = Math.max((flight.availableSeats || 0) + seatDiff, 0);

    await flight.save();
    res.json({ message: 'flight updated' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error updating flight', error: err.message });
  }
};

export const fetchFlight = async (req, res) => {
  try {
    const { adminId, flightName } = req.query;
    let filter = {};
    if (adminId || flightName) {
      filter = { $or: [] };
      if (adminId) filter.$or.push({ adminId });
      if (flightName) filter.$or.push({ flightName });
    }
    const flights = await Flight.find(filter);
    res.json(flights);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error fetching flights' });
  }
};

export const fetchFlightById = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) return res.status(404).json({ message: 'Flight not found' });
    res.json(flight);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error fetching flight by ID' });
  }
};

export const fetchBookings = async (req, res) => {
  try {
    const { operatorId, flightName } = req.query;
    let filter = {};
    if (operatorId || flightName) {
      filter = { $or: [] };
      if (operatorId) filter.$or.push({ operatorId });
      if (flightName) filter.$or.push({ flightName });
    }
    const bookings = await Booking.find(filter);
    res.json(bookings);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error fetching bookings' });
  }
};
