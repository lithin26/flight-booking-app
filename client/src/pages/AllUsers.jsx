import React, { useEffect, useState } from 'react'
import '../styles/Admin.css'
import axios from 'axios';

const AllUsers = () => {

  const [users, setUsers] = useState([]);

  useEffect(()=>{
    fetchUsers();
  },[]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/fetch-users');
      setUsers(response.data.reverse());
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  }

  const handleApprove = async (id) => {
    try {
      await axios.post('/approve-user', { id });
      alert('Operator Approved successfully!');
      fetchUsers();
    } catch (err) {
      alert('Error approving user');
    }
  }

  const handleReject = async (id) => {
    try {
      await axios.post('/reject-user', { id });
      alert('Operator Rejected!');
      fetchUsers();
    } catch (err) {
      alert('Error rejecting user');
    }
  }

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <h1>User Management</h1>
      </div>

      <section className="mb-5">
        <h2 className="mb-4" style={{color: '#64748b', fontSize: '1.25rem', fontWeight: '600'}}>Customer Base</h2>
        <div className="management-grid">
          {users.filter(user => user.usertype === 'customer').map((user) => (
            <div className="user-management-card" key={user._id}>
              <div className="card-header">
                <div className="user-info-main">
                  <h3>{user.username}</h3>
                  <span className="user-label-id">UID: {user._id.slice(-8).toUpperCase()}</span>
                </div>
                <div className="status-pill status-approved">Customer</div>
              </div>
              <div className="detail-row">
                <span style={{color: '#94a3b8', width: '20px'}}>✉</span>
                <span>{user.email}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4" style={{color: '#64748b', fontSize: '1.25rem', fontWeight: '600'}}>Airlines & Operators</h2>
        <div className="management-grid">
          {users.filter(user => user.usertype === 'flight-operator').map((user) => (
            <div className="user-management-card" key={user._id}>
              <div className="card-header">
                <div className="user-info-main">
                  <h3>{user.username}</h3>
                  <span className="user-label-id">OID: {user._id.slice(-8).toUpperCase()}</span>
                </div>
                <div className={`status-pill status-${user.approval}`}>
                  {user.approval.replace('-', ' ')}
                </div>
              </div>
              <div className="detail-row">
                <span style={{color: '#94a3b8', width: '20px'}}>✉</span>
                <span>{user.email}</span>
              </div>
              
              <div className="card-actions">
                {user.approval !== 'approved' && (
                  <button className="btn-action btn-approve" onClick={() => handleApprove(user._id)}>Approve</button>
                )}
                {user.approval !== 'rejected' && (
                  <button className="btn-action btn-reject" onClick={() => handleReject(user._id)}>Reject</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default AllUsers