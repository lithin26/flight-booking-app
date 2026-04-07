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
    let filterArr = [];
    if (adminId && adminId !== 'undefined' && adminId.match(/^[0-9a-fA-F]{24}$/)) {
      filterArr.push({ adminId });
    }
    if (flightName && flightName !== 'undefined') {
      const parts = flightName.trim().split(/\s+/);
      parts.forEach(p => {
        if (p.length > 2) filterArr.push({ flightName: { $regex: new RegExp(p, 'i') } });
      });
    }
    const filter = filterArr.length > 0 ? { $or: filterArr } : {};
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
    let filterArr = [];
    if (operatorId && operatorId !== 'undefined' && operatorId.match(/^[0-9a-fA-F]{24}$/)) {
      filterArr.push({ operatorId });
    }
    if (flightName && flightName !== 'undefined') {
      const parts = flightName.trim().split(/\s+/);
      parts.forEach(p => {
        if (p.length > 2) filterArr.push({ flightName: { $regex: new RegExp(p, 'i') } });
      });
    }
    const filter = filterArr.length > 0 ? { $or: filterArr } : {};
    const bookings = await Booking.find(filter).populate('flight');
    res.json(bookings);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error fetching bookings' });
  }
};

export const deleteFlight = async (req, res) => {
  const { id } = req.params;
  try {
    const flight = await Flight.findByIdAndDelete(id);
    if (!flight) return res.status(404).json({ message: 'Flight not found' });
    res.json({ message: 'Flight deleted successfully' });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: 'Server Error during flight deletion' });
  }
}
