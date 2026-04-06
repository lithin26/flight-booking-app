import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../styles/Admin.css'
import { useNavigate } from 'react-router-dom';

const FlightAdmin = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState();
  const [bookingCount, setBookingCount] = useState(0);
  const [flightsCount, setFlightsCount] = useState(0);

  useEffect(() => {
    fetchUserData();
    fetchStats();
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

  const fetchStats = async () => {
    try {
      const adminId = localStorage.getItem('userId');
      const flightName = localStorage.getItem('username');
      
      const [flightsRes, bookingsRes] = await Promise.all([
        axios.get(`/fetch-flights?adminId=${adminId}&flightName=${flightName}`),
        axios.get(`/fetch-bookings?operatorId=${adminId}&flightName=${flightName}`)
      ]);
      
      setFlightsCount(flightsRes.data.length);
      setBookingCount(bookingsRes.data.length);
    } catch (err) {
      console.error('Error fetching stats:', err);
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
          ) : userDetails.approval === 'rejected' ? (
            <div className="notApproved-box">
              <h3>Application Rejected!!</h3>
              <p>We are sorry to inform you that your application has been rejected!!</p>
            </div>
          ) : userDetails.approval === 'approved' ? (
            <>
              <div className="admin-header" style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <h1>Operator Command Center</h1>
                <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '600px', marginTop: '0.5rem' }}>
                    Welcome back, <b>{userDetails.username}</b>. Here is a real-time summary of your airline's technical operations and passenger traffic.
                </p>
              </div>

              <div className="management-grid">
                {/* Fleet Card */}
                <div className="user-management-card" style={{ display: 'flex', flexDirection: 'column', height: '400px' }}>
                  <div className="card-header">
                    <div className="user-info-main">
                      <h3>Fleet Summary</h3>
                      <span className="user-label-id">Technical Inventory</span>
                    </div>
                    <div className="status-pill status-approved" style={{ background: '#e0f2fe', color: '#0369a1' }}>ACTIVE</div>
                  </div>
                  
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#f8fafc', borderRadius: '0.75rem', margin: '0.5rem 0' }}>
                    <div style={{ fontSize: '4rem', fontWeight: '800', color: '#0f172a', lineHeight: 1 }}>{flightsCount}</div>
                    <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem', fontWeight: '600', textTransform: 'uppercase' }}>Flights In Air</div>
                  </div>

                  <div className="card-actions" style={{ border: 'none', padding: 0, marginTop: '1rem' }}>
                    <button className="btn btn-primary w-100" onClick={() => navigate('/flights')}>Open Fleet Manager</button>
                  </div>
                  <button className="btn btn-outline-secondary w-100" style={{ marginTop: '0.5rem', fontSize: '0.8rem' }} onClick={() => navigate('/new-flight')}>+ Deploy New Route</button>
                </div>

                {/* Bookings Card */}
                <div className="user-management-card" style={{ display: 'flex', flexDirection: 'column', height: '400px' }}>
                  <div className="card-header">
                    <div className="user-info-main">
                      <h3>Boarding Manifest</h3>
                      <span className="user-label-id">Passenger Traffic</span>
                    </div>
                    <div className="status-pill status-not-approved" style={{ background: '#f0fdf4', color: '#15803d' }}>BOOKED</div>
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#f8fafc', borderRadius: '0.75rem', margin: '0.5rem 0' }}>
                    <div style={{ fontSize: '4rem', fontWeight: '800', color: '#0f172a', lineHeight: 1 }}>{bookingCount}</div>
                    <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem', fontWeight: '600', textTransform: 'uppercase' }}>Confirmed Tickets</div>
                  </div>

                  <div className="card-actions" style={{ border: 'none', padding: 0, marginTop: '1rem' }}>
                    <button className="btn btn-primary w-100" onClick={() => navigate('/flight-bookings')}>View Manifest Table</button>
                  </div>
                  <div style={{ textAlign: 'center', marginTop: '0.75rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                      Real-time sync with boarding servers
                  </div>
                </div>

                {/* Quick Action Card (New Layout) */}
                <div className="user-management-card" style={{ display: 'flex', flexDirection: 'column', height: '400px', background: '#0f172a', border: 'none' }}>
                  <div className="card-header">
                    <div className="user-info-main">
                      <h3 style={{ color: 'white' }}>Quick Dispatch</h3>
                      <span className="user-label-id" style={{ color: '#94a3b8' }}>Immediate Deployment</span>
                    </div>
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '1rem' }}>
                    <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.6' }}>
                        Need to add a seasonal route or extra capacity? Use the dispatch tool to instantly add a new flight to the global booking engine.
                    </p>
                    <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem' }}>
                        <div style={{ color: '#3b82f6', fontWeight: '700', fontSize: '0.75rem', textTransform: 'uppercase' }}>Pro Tip</div>
                        <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: 0 }}>Regularly updating base fares can increase fleet load during off-peak hours.</p>
                    </div>
                  </div>

                  <div className="card-actions" style={{ border: 'none', padding: 0 }}>
                    <button className="btn btn-primary w-100" style={{ background: '#3b82f6', border: 'none', height: '50px', fontWeight: '700' }} onClick={() => navigate('/new-flight')}>
                        + Launch New Flight
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '5rem' }}>
            <p>Syncing Command Center Security...</p>
        </div>
      )}
    </div>
  );
};

export default FlightAdmin;