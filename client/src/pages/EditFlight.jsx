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
        
        <span className='newFlightSpan1'>
          <div className="form-floating mb-3">
                  <input type="text" className="form-control" id="floatingInputemail" value={flightName} onChange={(e)=> setFlightName(e.target.value)} />
                  <label htmlFor="floatingInputemail">Flight Name</label>
            </div>
            <div className="form-floating mb-3">
                  <input type="text" className="form-control" id="floatingInputmobile" value={flightId} onChange={(e)=> setFlightId(e.target.value)} />
                  <label htmlFor="floatingInputmobile">Flight Id</label>
            </div>
        </span>
        <span>
        <div className="form-floating">
            <select className="form-select form-select-sm mb-3" aria-label=".form-select-sm example" value={origin} onChange={(e)=> setOrigin(e.target.value)} >
              <option value="">Select</option>
              <option value="Chennai">Chennai</option>
              <option value="Banglore">Banglore</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Indore">Indore</option>
              <option value="Delhi">Delhi</option>
              <option value="Pune">Pune</option>
              <option value="Trivendrum">Trivendrum</option>
              <option value="Bhopal">Bhopal</option>
              <option value="Kolkata">Kolkata</option>
              <option value="varanasi">varanasi</option>
              <option value="Jaipur">Jaipur</option>
            </select>
            <label htmlFor="floatingSelect">Departure City</label>
          </div>
            <div className="form-floating mb-3">
                  <input type="time" className="form-control" id="floatingInputmobile" value={startTime} onChange={(e)=> setStartTime(e.target.value)} />
                  <label htmlFor="floatingInputmobile">Departure Time</label>
            </div>
        </span>
        <span>
            <div className="form-floating">
              <select className="form-select form-select-sm mb-3" aria-label=".form-select-sm example" value={destination} onChange={(e)=> setDestination(e.target.value)} >
                <option value="" selected>Select</option>
                <option value="Chennai">Chennai</option>
                <option value="Banglore">Banglore</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Indore">Indore</option>
                <option value="Delhi">Delhi</option>
                <option value="Pune">Pune</option>
                <option value="Trivendrum">Trivendrum</option>
                <option value="Bhopal">Bhopal</option>
                <option value="Kolkata">Kolkata</option>
                <option value="varanasi">varanasi</option>
                <option value="Jaipur">Jaipur</option>
              </select>
              <label htmlFor="floatingSelect">Destination City</label>
            </div>
            <div className="form-floating mb-3">
                  <input type="time" className="form-control" id="floatingInputArrivalTime" value={arrivalTime} onChange={(e)=> setArrivalTime(e.target.value)} />
                  <label htmlFor="floatingInputArrivalTime">Arrival time</label>
            </div>
        </span>
        <span className='newFlightSpan2'>
          <div className="form-floating mb-3">
                  <input type="number" className="form-control" id="floatingInpuSeats" value={totalSeats} onChange={(e)=> setTotalSeats(e.target.value)} />
                  <label htmlFor="floatingInpuSeats">Total seats</label>
            </div>
            <div className="form-floating mb-3">
                  <input type="number" className="form-control" id="floatingInputBasePrice" value={basePrice} onChange={(e)=> setBasePrice(e.target.value)} />
                  <label htmlFor="floatingInputBasePrice">Base price</label>
            </div>
        </span>
        
        <button className='btn btn-primary' onClick={handleSubmit}>Update</button>
      </div>
      </div>
    )
  }

export default EditFlight