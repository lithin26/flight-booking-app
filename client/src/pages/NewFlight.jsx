import React, { useEffect, useState } from 'react'
import '../styles/NewFlight.css'
import axios from 'axios';

const NewFlight = () => {
  const [userDetails, setUserDetails] = useState();

  useEffect(() => {
    fetchUserData();
  }, [])

  const fetchUserData = async () => {
    try {
      const id = localStorage.getItem('userId');
      const response = await axios.get(`/fetch-user/${id}`);
      setUserDetails(response.data);
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  }

  const [flightName, setFlightName] = useState(localStorage.getItem('username'));
  const [flightId, setFlightId] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [startTime, setStartTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [totalSeats, setTotalSeats] = useState(0);
  const [basePrice, setBasePrice] = useState(0);

  const handleSubmit = async () => {
    if (!flightName || !flightId || !origin || !destination || !startTime || !arrivalTime || !totalSeats || !basePrice) {
      alert('Please fill in all fields.');
      return;
    }
    if (origin === destination) {
      alert('Origin and Destination cannot be the same.');
      return;
    }

    const inputs = {
      flightName, flightId, origin, destination,
      departureTime: startTime, arrivalTime, basePrice, totalSeats,
      adminId: localStorage.getItem('userId')
    };

    await axios.post('/add-flight', inputs).then(
      async (response) => {
        alert('Flight added successfully!!');
        setFlightId('');
        setOrigin('');
        setStartTime('');
        setArrivalTime('');
        setDestination('');
        setBasePrice(0);
        setTotalSeats(0);
      }
    ).catch((err) => {
      alert('Failed to add flight. Please try again.');
      console.error(err);
    });
  }

  return (
    <div className='admin-dashboard-container'>
      {userDetails ? (
        <>
          {userDetails.approval === 'not-approved' ? (
            <div className="notApproved-box">
              <h3>Approval Required!!</h3>
              <p>Your application is under processing. It needs an approval from the administrator. Kindly please be patience!!</p>
            </div>
          ) : userDetails.approval === 'approved' ? (
            <div className="NewFlightPageContainer ani-scale-in" style={{ maxWidth: '800px', margin: '2rem auto', padding: '3rem', background: 'white', borderRadius: '1.5rem', boxShadow: 'var(--shadow-premium)' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '2.5rem', color: '#0f172a', textAlign: 'center' }}>Deploy New Flight Route</h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div className="form-floating mb-3">
                  <input type="text" className="form-control" id="flightNameInput" value={flightName} onChange={(e) => setFlightName(e.target.value)} placeholder="Flight Name" />
                  <label htmlFor="flightNameInput">Airline Name</label>
                </div>
                <div className="form-floating mb-3">
                  <input type="text" className="form-control" id="flightIdInput" value={flightId} onChange={(e) => setFlightId(e.target.value)} placeholder="Flight Id" />
                  <label htmlFor="flightIdInput">Flight ID (ICAO/IATA)</label>
                </div>

                <div className="form-floating mb-3">
                  <select className="form-select" id="originSelect" value={origin} onChange={(e) => setOrigin(e.target.value)}>
                    <option value="">Select Origin</option>
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
                  <label htmlFor="originSelect">Departure City</label>
                </div>
                <div className="form-floating mb-3">
                  <input type="time" className="form-control" id="startTimeInput" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                  <label htmlFor="startTimeInput">Take-off Time</label>
                </div>

                <div className="form-floating mb-3">
                  <select className="form-select" id="destinationSelect" value={destination} onChange={(e) => setDestination(e.target.value)}>
                    <option value="">Select Destination</option>
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
                  <label htmlFor="destinationSelect">Arrival City</label>
                </div>
                <div className="form-floating mb-3">
                  <input type="time" className="form-control" id="arrivalTimeInput" value={arrivalTime} onChange={(e) => setArrivalTime(e.target.value)} />
                  <label htmlFor="arrivalTimeInput">Landing Time</label>
                </div>

                <div className="form-floating mb-3">
                  <input type="number" className="form-control" id="seatsInput" value={totalSeats} onChange={(e) => setTotalSeats(e.target.value)} />
                  <label htmlFor="seatsInput">Total Aircraft Capacity</label>
                </div>
                <div className="form-floating mb-3">
                  <input type="number" className="form-control" id="priceInput" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} />
                  <label htmlFor="priceInput">Base Fare Listing (₹)</label>
                </div>
              </div>

              <div style={{ marginTop: '2.5rem', paddingTop: '2.5rem', borderTop: '2px solid #f1f5f9', width: '100%', textAlign: 'center' }}>
                <button
                  className='btn btn-primary'
                  style={{ width: '100%', maxWidth: '400px', margin: '0 auto', display: 'block', borderRadius: '0.85rem', fontWeight: '800', fontSize: '1.2rem', padding: '1rem', background: '#2563eb', border: 'none', boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.4)' }}
                  onClick={handleSubmit}
                >
                  🚀 Dispatch Flight Route
                </button>
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <p>Verifying operator credentials...</p>
      )}
    </div>
  )
}

export default NewFlight;