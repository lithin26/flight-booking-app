import mongoose from "mongoose";
const flightSchema = new mongoose.Schema({
    flightName: { type: String, required: true },
    flightId: { type: String, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    departureTime: { type: String, required: true },
    arrivalTime: { type: String, required: true },
    basePrice: { type: Number, required: true },
    totalSeats: { type: Number, required: true },
    availableSeats: { type: Number, required: true },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

flightSchema.pre('save', function(next) {
  if (this.isNew) {
    this.availableSeats = this.totalSeats;
  }
  next();
});
export const Flight = mongoose.model('Flight', flightSchema);