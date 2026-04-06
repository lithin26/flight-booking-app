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
      const flightName = localStorage.getItem('username');
      const response = await axios.get(`/fetch-flights?adminId=${adminId}&flightName=${flightName}`);
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
                        <span className="route-time-small">{flight.departureTime}</span>
                      </div>
                      <div className="route-icon" style={{ fontSize: '1.5rem' }}>✈</div>
                      <div className="route-point" style={{ textAlign: 'right' }}>
                        <span className="route-city-text">{flight.destination}</span>
                        <span className="route-code">{flight.destination.slice(0, 3).toUpperCase()}</span>
                        <span className="route-time-small">{flight.arrivalTime}</span>
                      </div>
                    </div>

                    <div className="professional-grid-layout" style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem'}}>
                            <div className="grid-cell">
                                <label style={{fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase'}}>Flight Identity</label>
                                <div style={{fontWeight: '700', color: '#1e293b'}}>{flight.flightName}</div>
                                <div style={{fontSize: '0.75rem', color: '#64748b'}}>{flight.flightId}</div>
                            </div>
                            <div className="grid-cell">
                                <label style={{fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase'}}>Capacity & Load</label>
                                <div style={{fontWeight: '700', color: '#1e293b'}}>{flight.availableSeats} / {flight.totalSeats}</div>
                                <div className={`status-badge-inline ${flight.availableSeats > 0 ? 'bg-success' : 'bg-danger'}`} style={{fontSize: '0.65rem', padding: '0 4px', borderRadius: '4px', color:'white'}}>
                                    {flight.availableSeats > 0 ? 'ACTIVE' : 'FULL'}
                                </div>
                            </div>
                            <div className="grid-cell" style={{textAlign: 'right'}}>
                                <label style={{fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase'}}>Base Fare</label>
                                <div style={{fontWeight: '800', fontSize: '1.2rem', color: '#0f172a'}}>₹{flight.basePrice}</div>
                            </div>
                        </div>
                    </div>

                    <div className="card-actions" style={{ padding: '1.25rem' }}>
                      <button className="btn btn-outline-primary w-100" style={{ borderRadius: '8px', fontWeight: '600' }} onClick={() => navigate(`/edit-flight/${flight._id}`)}>
                        Update Fleet Records
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