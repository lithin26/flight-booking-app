import React, { useEffect, useState } from 'react'
import '../styles/allUsers.css'
import axios from 'axios';

const AllUsers = () => {

  const [users, setUsers] = useState([]);

  useEffect(()=>{
    fetchUsers();
  },[]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/fetch-users');
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  }

  return (
    <div className="all-users-page">
      <h2>All Users</h2>
      <div className="all-users">
        {users.filter(user => user.usertype === 'customer').map((user) => {
          return (
            <div className="user" key={user._id}>
              <p><b>UserId: </b>{user._id}</p>
              <p><b>Username: </b>{user.username}</p>
              <p><b>Email: </b>{user.email}</p>
            </div>
          )
        })}
      </div>

      <h2>Flight Operators</h2>
      <div className="all-users">
        {users.filter(user => user.usertype === 'flight-operator').map((user) => {
          return (
            <div className="user" key={user._id}>
              <p><b>Id: </b>{user._id}</p>
              <p><b>Operator Name: </b>{user.username}</p>
              <p><b>Email: </b>{user.email}</p>
              <p><b>Status: </b>{user.approval}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default AllUsers