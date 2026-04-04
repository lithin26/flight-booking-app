import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../styles/FlightAdmin.css'
import { useNavigate } from 'react-router-dom';

const FlightAdmin = () => {

  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState();
  const [bookingCount, setbookingCount] = useState(0);
  const [flightsCount, setFlightsCount] = useState(0);

  useEffect(()=>{
    fetchUserData();
  }, [])

  const fetchUserData = async () =>{
    try{
      const id = localStorage.getItem('userId');
      await axios.get(`/fetch-user/${id}`).then(
        (response)=>{
          setUserDetails(response.data);
          console.log(response.data);
        }
      )

    }catch(err){

    }
  } 


  useEffect(()=>{

    fetchData();
  }, [])

  const fetchData = async () => {
    const operatorName = localStorage.getItem('username');
    const [bookingsRes, flightsRes] = await Promise.all([
      axios.get('/fetch-bookings'),
      axios.get('/fetch-flights')
    ]);
    // Only count flights that belong to this operator
    const myFlights = flightsRes.data.filter(f => f.flightName === operatorName);
    setFlightsCount(myFlights.length);

    // Only count bookings for this operator's flights
    const myFlightIds = myFlights.map(f => f._id);
    const myBookings = bookingsRes.data.filter(b => myFlightIds.includes(String(b.flight)));
    setbookingCount(myBookings.length);
  }

  return (
    <div className="flightAdmin-page">

      {userDetails ?
        <>
          {userDetails.approval === 'not-approved' ?
            <div className="notApproved-box">
              <h3>Approval Required!!</h3>
              <p>Your application is under processing. It needs an approval from the administrator. Kindly please be patience!!</p>
            </div>


          : userDetails.approval === 'rejected' ?
            <div className="notApproved-box">
              <h3>Application Rejected!!</h3>
              <p>We are sorry to inform you that your application has been rejected!!</p>
          </div>
          : userDetails.approval === 'approved' ?
            

          <div className="admin-page-cards">

          <div className="card admin-card transactions-card">
              <h4>Bookings</h4>
              <p> {bookingCount} </p>
              <button className="btn btn-primary" onClick={()=>navigate('/flight-bookings')}>View all</button>
          </div>

          <div className="card admin-card deposits-card">
              <h4>Flights</h4>
              <p> {flightsCount} </p>
              <button className="btn btn-primary" onClick={()=>navigate('/flights')}>View all</button>
          </div>

          <div className="card admin-card loans-card">
              <h4>New Flight</h4>
              <p> (new route) </p>
              <button className="btn btn-primary" onClick={()=>navigate('/new-flight')}>Add now</button>
          </div>

      </div>

          :
            ""
          }
        </>
      :
       ""
      }

    </div>
  )
}

export default FlightAdmin