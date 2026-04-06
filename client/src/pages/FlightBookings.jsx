import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../styles/Bookings.css';

const FlightBookings = () => {
  const [userDetails, setUserDetails] = useState();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchUserData();
    fetchBookings();
  }, []);

  const fetchUserData = async () => {
    try {
      const id = localStorage.getItem('userId');
      const response = await axios.get(`/fetch-user/${id}`);
      setUserDetails(response.data);
      console.log('User data:', response.data);
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  const fetchBookings = async () => {
    try {
      const operatorName = localStorage.getItem('username');
      const response = await axios.get('/fetch-bookings');
      // Only show bookings for this operator's flights
      const myBookings = response.data.filter(b => b.flightName === operatorName);
      setBookings(myBookings.reverse());
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  const cancelTicket = async (id) => {
    try {
      await axios.put(`/cancel-ticket/${id}`);
      alert('Ticket cancelled!!');
      fetchBookings();
    } catch (err) {
      console.error('Error cancelling ticket:', err);
      alert('Failed to cancel ticket.');
    }
  };

  return (
    <div className="user-bookingsPage">
      {userDetails ? (
        <>
          {userDetails.approval === 'not-approved' ? (
            <div className="notApproved-box">
              <h3>Approval Required!!</h3>
              <p>Your application is under processing. It needs an approval from the administrator. Kindly please be patience!!</p>
            </div>
          ) : userDetails.approval === 'approved' ? (
            <>
              <h1>Operator Control: Flight Manifests</h1>
              <div className="user-bookings">
                {bookings.map((booking) => (
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
                        <span className="detail-label">Seats Assigned</span>
                        <span className="detail-value">{booking.seats || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="booking-passengers">
                      <span className="detail-label">Manifest (Passenger List)</span>
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
                        <span className="detail-label">Revenue Share</span>
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
                          Request Cancellation
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </>
      ) : (
        <p>Loading user details...</p>
      )}
    </div>
  );
};

export default FlightBookings;
