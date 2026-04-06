import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../styles/Admin.css';

const Flights = () => {
  const [userDetails, setUserDetails] = useState();
  const [flights, setFlights] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
    fetchFlights();
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

  const fetchFlights = async () => {
    try {
      const adminId = localStorage.getItem('userId');
      const response = await axios.get(`/fetch-flights?adminId=${adminId}`);
      setFlights(response.data.reverse());
    } catch (err) {
      console.error('Error fetching flights:', err);
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
                <h1>Manage My Flights</h1>
                <button className="btn btn-primary" onClick={() => navigate('/new-flight')}>+ Add Flight</button>
              </div>

              <div className="management-grid">
                {flights.map((flight) => (
                  <div className="flight-admin-card" key={flight._id}>
                    <div className="flight-route-banner">
                      <div className="route-point">
                        <span className="route-city-text">{flight.origin}</span>
                        <span className="route-code">{flight.origin.slice(0, 3).toUpperCase()}</span>
                      </div>
                      <div className="route-icon" style={{ fontSize: '1.5rem' }}>✈</div>
                      <div className="route-point" style={{ textAlign: 'right' }}>
                        <span className="route-city-text">{flight.destination}</span>
                        <span className="route-code">{flight.destination.slice(0, 3).toUpperCase()}</span>
                      </div>
                    </div>

                    <div style={{ padding: '1.25rem', borderBottom: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '700', color: '#1e293b' }}>{flight.flightName}</h3>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Flight ID: {flight.flightId}</span>
                        </div>
                        <div className={`status-pill ${flight.availableSeats > 0 ? 'status-approved' : 'status-rejected'}`}>
                          {flight.availableSeats > 0 ? 'Active' : 'Sold Out'}
                        </div>
                      </div>
                    </div>

                    <div className="flight-stats-grid">
                      <div className="stat-box">
                        <span className="stat-label">Departure</span>
                        <span className="stat-value">{flight.departureTime}</span>
                      </div>
                      <div className="stat-box">
                        <span className="stat-label">Arrival</span>
                        <span className="stat-value">{flight.arrivalTime}</span>
                      </div>
                      <div className="stat-box">
                        <span className="stat-label">Base Price</span>
                        <span className="stat-value">₹{flight.basePrice}</span>
                      </div>
                      <div className="stat-box">
                        <span className="stat-label">Load (Seats)</span>
                        <span className="stat-value">{flight.availableSeats} / {flight.totalSeats}</span>
                      </div>
                    </div>

                    <div className="card-actions" style={{ padding: '0 1.25rem 1.25rem' }}>
                      <button className="btn-action btn-approve w-100" style={{ background: '#3b82f6' }} onClick={() => navigate(`/edit-flight/${flight._id}`)}>
                        Edit Flight Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </>
      ) : (
        <p>Loading operator profile...</p>
      )}
    </div>
  );
};

export default Flights;