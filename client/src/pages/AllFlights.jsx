import React, { useEffect, useState } from 'react'
import '../styles/Admin.css'
import axios from 'axios';

const AllFlights = () => {
    const [flights, setFlights] = useState([]);
  
    const fetchFlights = async () => {
      try {
        const response = await axios.get('/fetch-flights');
        setFlights(response.data.reverse());
      } catch (err) {
        console.error('Error fetching flights:', err);
      }
    }
      
    useEffect(()=>{
      fetchFlights();
    }, [])
      
    return (
      <div className="admin-dashboard-container">
        <div className="admin-header">
          <h1>Global Flight Inventory</h1>
        </div>

        <div className="management-grid">
          {flights.map((flight) => (
            <div className="flight-admin-card" key={flight._id}>
              <div className="flight-route-banner">
                <div className="route-point">
                  <span className="route-city-text">{flight.origin}</span>
                  <span className="route-code">{flight.origin.slice(0, 3).toUpperCase()}</span>
                </div>
                <div className="route-icon" style={{fontSize: '1.5rem'}}>✈</div>
                <div className="route-point" style={{textAlign: 'right'}}>
                  <span className="route-city-text">{flight.destination}</span>
                  <span className="route-code">{flight.destination.slice(0, 3).toUpperCase()}</span>
                </div>
              </div>

              <div style={{padding: '1.25rem', borderBottom: '1px solid #f1f5f9'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div>
                    <h3 style={{margin: 0, fontSize: '1.125rem', fontWeight: '700', color: '#1e293b'}}>{flight.flightName}</h3>
                    <span style={{fontSize: '0.75rem', color: '#64748b'}}>ID: {flight.flightId}</span>
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
                  <span className="stat-label">Available Seats</span>
                  <span className="stat-value">{flight.availableSeats} / {flight.totalSeats}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

export default AllFlights;