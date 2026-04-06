import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../styles/Admin.css';

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
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  const fetchBookings = async () => {
    try {
      const operatorId = localStorage.getItem('userId');
      const flightName = localStorage.getItem('username');
      // Hybrid fetch: Both ID and Name to ensure visibility of legacy data
      const response = await axios.get(`/fetch-bookings?operatorId=${operatorId}&flightName=${flightName}`);
      setBookings(response.data.reverse());
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  const cancelTicket = async (id) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await axios.put(`/cancel-ticket/${id}`);
        alert('Ticket cancelled successfully.');
        fetchBookings();
      } catch (err) {
        console.error('Error cancelling ticket:', err);
        alert('Failed to cancel ticket.');
      }
    }
  };

  return (
    <div className="admin-dashboard-container">
      {userDetails ? (
        <>
          {userDetails.approval === 'not-approved' ? (
            <div className="notApproved-box">
              <h3>Approval Required!!</h3>
              <p>Your application is under processing. It needs an approval from the administrator. Kindly please be patience!!</p>
            </div>
          ) : userDetails.approval === 'approved' ? (
            <>
              <div className="admin-header">
                <h1>Passenger Manifests</h1>
                <div style={{color: '#64748b', fontSize: '0.875rem'}}>
                    Total Bookings: <b>{bookings.length}</b>
                </div>
              </div>

              <div className="manifest-container">
                <div className="manifest-table-wrapper">
                  <table className="manifest-table">
                    <thead>
                      <tr>
                        <th>Flight Details</th>
                        <th>Journey Info</th>
                        <th>Customer Contact</th>
                        <th>Passengers & Class</th>
                        <th>Financials</th>
                        <th>Status & Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking._id}>
                          <td>
                            <div style={{fontWeight: '700'}}>{booking.flightName}</div>
                            <span className="flight-id-badge">{booking.flightId}</span>
                          </td>
                          <td>
                            <div style={{fontSize: '0.8rem', fontWeight: '600'}}>{booking.departure} → {booking.destination}</div>
                            <div style={{fontSize: '0.75rem', color: '#64748b'}}>{booking.journeyTime} | {booking.journeyDate}</div>
                          </td>
                          <td>
                            <div style={{fontSize: '0.85rem'}}>{booking.email}</div>
                            <div style={{fontSize: '0.75rem', color: '#64748b'}}>{booking.mobile}</div>
                          </td>
                          <td>
                            <div style={{marginBottom: '4px'}}>
                                <span className="passenger-tag" style={{background: '#f1f5f9', color: '#475569'}}>{booking.seatClass.toUpperCase()}</span>
                            </div>
                            {booking.passengers.map((p, i) => (
                              <span key={i} className="passenger-tag">
                                {p.name} ({p.age})
                              </span>
                            ))}
                          </td>
                          <td>
                            <div style={{fontWeight: '700', color: '#0f172a'}}>₹{booking.totalPrice}</div>
                            <div style={{fontSize: '0.7rem', color: '#94a3b8'}}>Paid via Razorpay</div>
                          </td>
                          <td>
                            <div className={`status-pill status-${booking.bookingStatus}`} style={{display: 'inline-block', marginBottom: '8px'}}>
                              {booking.bookingStatus}
                            </div>
                            {booking.bookingStatus === 'confirmed' && (
                                <div>
                                    <button 
                                        className="btn btn-sm btn-outline-danger" 
                                        style={{fontSize: '0.7rem', padding: '2px 8px'}}
                                        onClick={() => cancelTicket(booking._id)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {bookings.length === 0 && (
                    <div style={{padding: '3rem', textAlign: 'center', color: '#94a3b8'}}>
                        No passenger records found for your flights.
                    </div>
                )}
              </div>
            </>
          ) : null}
        </>
      ) : (
        <p>Loading records...</p>
      )}
    </div>
  );
};

export default FlightBookings;
