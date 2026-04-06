import React, { useEffect, useState } from 'react'
import '../styles/NewFlight.css'
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditFlight = () => {
    const [flightName, setFlightName] = useState('');
    const [flightId, setFlightId] = useState('');
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [startTime, setStartTime] = useState();
    const [arrivalTime, setArrivalTime] = useState();
    const [totalSeats, setTotalSeats] = useState(0);
    const [basePrice, setBasePrice] = useState(0);
  
  
  
    const {id} = useParams();
  
    useEffect(()=>{
      console.log(startTime);
    }, [startTime])
  
    useEffect(()=>{
      fetchFlightData();
    }, [])
  
    const fetchFlightData = async () =>{
      await axios.get(`/fetch-flight/${id}`).then(
        (response) =>{
          console.log(response.data);
          setFlightName(response.data.flightName);
          setFlightId(response.data.flightId);
          setOrigin(response.data.origin);
          setDestination(response.data.destination);
          setTotalSeats(response.data.totalSeats);
          setBasePrice(response.data.basePrice);
  
          const timeParts1 = response.data.departureTime.split(":");
          const startT = new Date();
          startT.setHours(parseInt(timeParts1[0], 10));
          startT.setMinutes(parseInt(timeParts1[1], 10));
          const hours1 = String(startT.getHours()).padStart(2, '0');
          const minutes1 = String(startT.getMinutes()).padStart(2, '0');
  
          setStartTime(`${hours1}:${minutes1}`);
  
          const timeParts2 = response.data.arrivalTime.split(":");
          const startD = new Date();
          startD.setHours(parseInt(timeParts2[0], 10));
          startD.setMinutes(parseInt(timeParts2[1], 10));
          const hours2 = String(startD.getHours()).padStart(2, '0');
          const minutes2 = String(startD.getMinutes()).padStart(2, '0');
  
          setArrivalTime(`${hours2}:${minutes2}`);
  
        }
      )
    }
  
    const navigate = useNavigate();

    const handleSubmit = async () => {
      if (!flightName || !flightId || !origin || !destination || !startTime || !arrivalTime || !totalSeats || !basePrice) {
        alert('Please fill in all fields.');
        return;
      }
      if (origin === destination) {
        alert('Origin and Destination cannot be the same.');
        return;
      }
  
      const inputs = {_id: id, flightName, flightId, origin, destination, 
        departureTime: startTime, arrivalTime, basePrice, totalSeats};
  
      await axios.put('/update-flight', inputs).then(
        async (response) => {
          alert('Flight updated successfully!!');
          navigate('/flights');
        }
      ).catch((err) => {
        alert('Failed to update flight. Please try again.');
        console.error(err);
      });
    }
  
    return (
      <div className='admin-dashboard-container'>
        <div className='NewFlightPageContainer' style={{maxWidth: '800px', margin: '0 auto', padding: '2rem', background: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}}>
            <h2 style={{fontSize: '1.75rem', fontWeight: '800', marginBottom: '2rem', color: '#0f172a'}}>Operations: Edit Flight Details</h2>
        
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem'}}>
            <div className="form-floating mb-3">
                  <input type="text" className="form-control" id="flightNameEdit" value={flightName} onChange={(e)=> setFlightName(e.target.value)} />
                  <label htmlFor="flightNameEdit">Flight Name</label>
            </div>
            <div className="form-floating mb-3">
                  <input type="text" className="form-control" id="flightIdEdit" value={flightId} onChange={(e)=> setFlightId(e.target.value)} />
                  <label htmlFor="flightIdEdit">Flight ID</label>
            </div>
            <div className="form-floating mb-3">
              <select className="form-select" id="originSelect" value={origin} onChange={(e)=> setOrigin(e.target.value)} >
                <option value="">Select Origin</option>
                <option value="Chennai">Chennai</option>
                <option value="Banglore">Banglore</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Pune">Pune</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Jaipur">Jaipur</option>
              </select>
              <label htmlFor="originSelect">Departure City</label>
            </div>
            <div className="form-floating mb-3">
              <select className="form-select" id="destSelect" value={destination} onChange={(e)=> setDestination(e.target.value)} >
                <option value="">Select Destination</option>
                <option value="Chennai">Chennai</option>
                <option value="Banglore">Banglore</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Pune">Pune</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Jaipur">Jaipur</option>
              </select>
              <label htmlFor="destSelect">Destination City</label>
            </div>
            <div className="form-floating mb-3">
                  <input type="time" className="form-control" id="startTimeEdit" value={startTime} onChange={(e)=> setStartTime(e.target.value)} />
                  <label htmlFor="startTimeEdit">Departure Time</label>
            </div>
            <div className="form-floating mb-3">
                  <input type="time" className="form-control" id="arrivalTimeEdit" value={arrivalTime} onChange={(e)=> setArrivalTime(e.target.value)} />
                  <label htmlFor="arrivalTimeEdit">Arrival Time</label>
            </div>
            <div className="form-floating mb-3">
                  <input type="number" className="form-control" id="totalSeatsEdit" value={totalSeats} onChange={(e)=> setTotalSeats(e.target.value)} />
                  <label htmlFor="totalSeatsEdit">Total Capacity</label>
            </div>
            <div className="form-floating mb-3">
                  <input type="number" className="form-control" id="basePriceEdit" value={basePrice} onChange={(e)=> setBasePrice(e.target.value)} />
                  <label htmlFor="basePriceEdit">Base Price (₹)</label>
            </div>
        </div>

        <div style={{marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'center'}}>
            <button 
                className='btn btn-primary' 
                style={{borderRadius: '0.75rem', fontWeight: '800', fontSize: '1.1rem', padding: '0.8rem 3rem', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', border: 'none', boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.4)'}} 
                onClick={handleSubmit}
            >
                🚀 Save Updated Details
            </button>
        </div>
      </div>
      </div>
    )
  }

export default EditFlight