import React, { useEffect, useState } from 'react'
import '../styles/Admin.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Admin = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [bookingCount, setbookingCount] = useState(0);
  const [flightsCount, setFlightsCount] = useState(0);
  useEffect(()=>{
    fetchData();
  }, [])
  const fetchData = async () => {
    await axios.get('/fetch-users').then(
      (response) => {   
        // Count only customer and flight-operator accounts, not admins
        const nonAdminUsers = response.data.filter(user => user.usertype !== 'admin');
        setUserCount(nonAdminUsers.length);
        setUsers(response.data.filter(user => user.approval === 'not-approved'));
      });
    await axios.get('/fetch-bookings').then(
      (response) => {
        setbookingCount(response.data.length);
      });
    await axios.get('/fetch-flights').then(
      (response) => {
        setFlightsCount(response.data.length);
      });
  }
 const approveRequest = async (id) => {
      try {
          await axios.post('/approve-operator', {id});
          alert("Operator approved!!");
          fetchData();
      } catch(err) {
          alert("Failed to approve operator.");
          console.error(err);
      }
  }

  const rejectRequest = async (id) => {
    try {
      await axios.post('/reject-operator', {id});
      alert("Operator rejected!!");
      fetchData();
    } catch(err) {
      alert("Failed to reject operator.");
      console.error(err);
    }
  }

  return (
    <div className='admin-dashboard-container'>
      <div className="admin-header">
        <div>
          <h1>Administrator Control Panel</h1>
          <p style={{color: '#64748b', fontSize: '0.95rem', marginTop: '0.5rem'}}>Global Platform Management & Operator Oversight</p>
        </div>
        <div style={{background: '#e0e7ff', color: '#4338ca', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '600'}}>
          Live Dashboard
        </div>
      </div>

      <div className="admin-stats-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem'}}>
          <div className="admin-stat-card" style={{background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
              <h4 style={{color: '#64748b', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase'}}>Global Users</h4>
              <p style={{fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: '0.5rem 0'}}>{userCount}</p>
              <button className="btn btn-primary btn-sm" style={{width: 'auto', padding: '0.4rem 1.2rem'}} onClick={()=>navigate('/all-users')}>Manage Users</button>
          </div>
          <div className="admin-stat-card" style={{background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
              <h4 style={{color: '#64748b', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase'}}>Total Bookings</h4>
              <p style={{fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: '0.5rem 0'}}>{bookingCount}</p>
              <button className="btn btn-primary btn-sm" style={{width: 'auto', padding: '0.4rem 1.2rem'}} onClick={()=>navigate('/all-bookings')}>View Records</button>
          </div>
          <div className="admin-stat-card" style={{background: 'white', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
              <h4 style={{color: '#64748b', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase'}}>Active Flights</h4>
              <p style={{fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: '0.5rem 0'}}>{flightsCount}</p>
              <button className="btn btn-primary btn-sm" style={{width: 'auto', padding: '0.4rem 1.2rem'}} onClick={()=>navigate('/all-flights')}>Fleet Control</button>
          </div>
      </div>

      <div className="admin-requests-container">
          <h3 style={{fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '1.5rem'}}>Operator Registration Manifest</h3>
          <div className="admin-requests" style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
            {
              users.length === 0 ?
                <div style={{textAlign: 'center', padding: '3rem', background: '#f1f5f9', borderRadius: '1rem', color: '#64748b'}}>
                  <p>No new operator applications at this time.</p>
                </div>
              :
                <>
                {users.map((user)=>{
                  return(
                    <div className="admin-app-card" key={user._id} style={{background: 'white', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <div style={{display: 'flex', gap: '2rem', alignItems: 'center'}}>
                        <div>
                          <p style={{margin: 0, fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: '600'}}>Operator Name</p>
                          <p style={{margin: 0, fontWeight: '700', color: '#1e293b'}}>{user.username}</p>
                        </div>
                        <div>
                          <p style={{margin: 0, fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: '600'}}>Official Email</p>
                          <p style={{margin: 0, color: '#475569'}}>{user.email}</p>
                        </div>
                      </div>
                      <div className="admin-request-actions" style={{display: 'flex', gap: '0.75rem'}}>
                        <button className='btn btn-success' style={{padding: '0.4rem 1.5rem', fontWeight: '600'}} onClick={()=> approveRequest(user._id)}>Approve</button>
                        <button className='btn btn-outline-danger' style={{padding: '0.4rem 1.5rem', fontWeight: '600'}} onClick={()=> rejectRequest(user._id)}>Reject</button>
                      </div>
                    </div>
                  )
                })}
                </>
            }
          </div>
      </div>
    </div>   
  )
}

export default Admin