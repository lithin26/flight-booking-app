import axios from 'axios';
import React, { useEffect, useState } from 'react'
import '../styles/Admin.css';

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
          <h1>Global Flight Registry</h1>
          <div style={{color: '#64748b', fontSize: '0.875rem'}}>
            Active Fleet Count: <b>{flights.length}</b>
          </div>
        </div>

        <div className="management-grid">
          {flights.map((flight) => (
            <div className="flight-admin-card" key={flight._id}>
              <div className="flight-route-banner" style={{background: '#1e293b'}}> 
                <div className="route-point">
                  <span className="route-city-text">{flight.origin}</span>
                  <span className="route-code">{flight.origin.slice(0, 3).toUpperCase()}</span>
                  <span className="route-time-small">{flight.departureTime}</span>
                </div>
                <div className="route-icon" style={{fontSize: '1.5rem'}}>✈</div>
                <div className="route-point" style={{textAlign: 'right'}}>
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
                          <div className={`status-pill ${flight.availableSeats > 0 ? 'status-approved' : 'status-rejected'}`} style={{fontSize: '0.65rem', padding: '0 4px', borderRadius: '4px', marginTop: '2px', display: 'inline-block'}}>
                              {flight.availableSeats > 0 ? 'ACTIVE' : 'SOLD OUT'}
                          </div>
                      </div>
                      <div className="grid-cell" style={{textAlign: 'right'}}>
                          <label style={{fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase'}}>Base Fare</label>
                          <div style={{fontWeight: '800', fontSize: '1.2rem', color: '#0f172a'}}>₹{flight.basePrice}</div>
                          <div style={{fontSize: '0.65rem', color: '#94a3b8'}}>Per Economy Seat</div>
                      </div>
                  </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

export default AllFlights;