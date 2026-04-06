import axios from 'axios';
import React, { useEffect, useState } from 'react'
import '../styles/Bookings.css';

const AllBookings = () => {

  const [bookings, setBookings] = useState([]);

  const userId = localStorage.getItem('userId');

  useEffect(()=>{
    fetchBookings();
  }, [])

  const fetchBookings = async () =>{
    await axios.get('/fetch-bookings').then(
      (response)=>{
        setBookings(response.data.reverse());
      }
    )
  }

  const cancelTicket = async (id) => {
    try {
      await axios.put(`/cancel-ticket/${id}`);
      alert("Ticket cancelled!!");
      fetchBookings();
    } catch (err) {
      console.error('Cancellation error:', err);
      alert("Failed to cancel ticket.");
    }
  }

  return (
    <div className="user-bookingsPage">
      <h1>Global Booking Records (Admin)</h1>

      <div className="user-bookings">

        {bookings.map((booking) => {
          return (
            <div className="user-booking" key={booking._id}>
              
              <div className="booking-header">
                <span className="booking-id">ID: {booking._id.slice(-8).toUpperCase()}</span>
                <span className="booking-date">Booked: {booking.bookingDate?.slice(0, 10)}</span>
              </div>

              <div className="booking-route">
                <div className="route-point">
                  <span className="route-city">{booking.departure}</span>
                  <span className="route-time">{booking.journeyTime}</span>
                </div>
                <div className="route-icon">✈</div>
                <div className="route-point">
                  <span className="route-city">{booking.destination}</span>
                  <span className="route-time">Arrival: {booking.arrivalTime || '--:--'}</span>
                </div>
              </div>

              <div className="booking-details-grid">
                <div className="detail-item">
                  <span className="detail-label">Flight</span>
                  <span className="detail-value">{booking.flightName} ({booking.flightId})</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Customer Contact</span>
                  <span className="detail-value">{booking.mobile} / {booking.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Class</span>
                  <span className="detail-value" style={{textTransform: 'capitalize'}}>{booking.seatClass}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Seats</span>
                  <span className="detail-value">{booking.seats || 'N/A'}</span>
                </div>
              </div>

              <div className="booking-passengers">
                <span className="detail-label">Passenger Roster</span>
                <div className="passenger-list">
                  {booking.passengers.map((passenger, i) => (
                    <div key={i} className="passenger-item">
                      <span>{passenger.name}</span>
                      <span style={{color: '#94a3b8'}}>Age: {passenger.age}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="booking-footer">
                <div className={`status-badge status-${booking.bookingStatus}`}>
                  {booking.bookingStatus}
                </div>
                <div className="total-price-box">
                  <span className="detail-label">Revenue</span>
                  <div className="price">₹{booking.totalPrice}</div>
                </div>
              </div>

              {booking.bookingStatus === 'confirmed' && (
                <div style={{padding: '0 1.5rem 1.5rem'}}>
                  <button 
                    className="btn btn-outline-danger w-100" 
                    style={{borderRadius: '0.5rem', fontWeight: '600'}}
                    onClick={() => cancelTicket(booking._id)}
                  >
                    Force Cancel (Admin)
                  </button>
                </div>
              )}
            </div>
          );
        })}

          
      </div>
    </div>
  )
}

export default AllBookings