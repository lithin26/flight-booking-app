import { Booking } from '../models/bookingSchema.js';
import { Flight } from '../models/flightSchema.js';

export const fetchBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    const currentTime = new Date();
    let updated = false;

    // Dynamically check and update status for each booking
    for (const booking of bookings) {
      if (booking.bookingStatus === 'confirmed') {
        const journeyDate = new Date(booking.journeyDate);
        const [hours, minutes] = booking.journeyTime.split(':').map(Number);
        journeyDate.setHours(hours, minutes, 0, 0);

        if (journeyDate < currentTime) {
          booking.bookingStatus = 'completed';
          await booking.save();
          updated = true;
        }
      }
    }

    // If any status was updated, we fetch the updated list to be sure (or just return the modified array)
    const finalBookings = updated ? await Booking.find() : bookings;
    res.status(200).json(finalBookings);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};

export const bookTicket = async (req, res) => {
  const user = req.user.id;
  const { flight, flightName, flightId, departure, destination, email, mobile, passengers, totalPrice, journeyDate, journeyTime, arrivalTime, seatClass, paymentId, paymentStatus } = req.body;

  try {
    const seatsToBook = passengers.length;

    const updatedFlight = await Flight.findOneAndUpdate(
      { _id: flight, availableSeats: { $gte: seatsToBook } },
      { $inc: { availableSeats: -seatsToBook } },
      { new: true }
    );

    if (!updatedFlight) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    const bookings = await Booking.find({ flight, journeyDate, seatClass });
    const numBookedSeats = bookings.reduce((acc, b) => acc + b.passengers.length, 0);

    let seats = '';
    const seatCode = { economy: 'E', 'premium-economy': 'P', business: 'B', 'first-class': 'A' };
    const coach = seatCode[seatClass];

    for (let i = numBookedSeats + 1; i < numBookedSeats + passengers.length + 1; i++) {
      seats += (seats === '' ? '' : ', ') + coach + '-' + i;
    }

    const booking = new Booking({
      user, flight, flightName, flightId, departure, destination, email, mobile,
      passengers, totalPrice, journeyDate, journeyTime, arrivalTime, seatClass, seats,
      operatorId: updatedFlight.adminId,
      bookingStatus: 'confirmed', paymentId, paymentStatus
    });

    await booking.save();

    res.status(201).json({ message: 'Booking successful!', booking });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ message: 'Server error while booking', error: err.message });
  }
};

export const cancelTicket = async (req, res) => {
  const id = req.params.id;

  try {
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.bookingStatus === 'cancelled')
      return res.status(400).json({ message: 'Booking already cancelled' });

    booking.bookingStatus = 'cancelled';
    await booking.save();

    const seatsToRelease = booking.passengers.length;
    await Flight.findByIdAndUpdate(
      booking.flight,
      { $inc: { availableSeats: seatsToRelease } }
    );

    res.json({ message: 'Booking cancelled and seats released successfully' });
  } catch (err) {
    console.error('Cancellation error:', err);
    res.status(500).json({ message: 'Server error while cancelling booking', error: err.message });
  }
};


