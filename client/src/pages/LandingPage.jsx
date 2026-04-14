import React, { useContext, useEffect, useState, useRef } from 'react'
import '../styles/LandingPage.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GeneralContext } from '../context/GeneralContext';

const LandingPage = () => {
  const [error, setError] = useState('');
  const [checkBox, setCheckBox] = useState(false);
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState();
  const [returnDate, setReturnDate] = useState();
  const navigate = useNavigate();
  
  const resultsRef = useRef(null);

  useEffect(() => {
    if (localStorage.getItem('userType') === 'admin') {
      navigate('/admin');
    } else if (localStorage.getItem('userType') === 'flight-operator') {
      navigate('/flight-admin');
    }
  }, []);

  const [Flights, setFlights] = useState([]);

  const scrollToResults = () => {
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  const fetchFlights = async () => {
    if (departure !== "" && destination !== "" && departure === destination) {
      setError("Departure and Destination cannot be the same");
      return;
    }

    if (checkBox) {
      if (departure !== "" && destination !== "" && departureDate && returnDate) {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        const date1 = new Date(departureDate);
        const date2 = new Date(returnDate);
        if (date1 >= date && date2 > date1) {
          setError("");
          try {
            const response = await axios.get('/fetch-flights');
            setFlights(response.data);
            scrollToResults();
          } catch (err) {
            setError("Error fetching flights. Please try again.");
          }
        } else { setError("Please check the dates"); }
      } else { setError("Please fill all the inputs"); }
    } else {
      if (departure !== "" && destination !== "" && departureDate) {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        const date1 = new Date(departureDate);
        if (date1 >= date) {
          setError("");
          try {
            const response = await axios.get('/fetch-flights');
            setFlights(response.data);
            scrollToResults();
          } catch (err) {
            setError("Error fetching flights. Please try again.");
          }
        } else { setError("Please check the dates"); }
      } else { setError("Please fill all the inputs"); }
    }
  }
  const { setTicketBookingDate } = useContext(GeneralContext);
  const userId = localStorage.getItem('userId');


  const handleTicketBooking = async (id, origin, destination) => {
    if (userId) {
      if (origin === departure) {
        setTicketBookingDate(departureDate);
        navigate(`/book-Flight/${id}`);
      } else if (origin === destination) {
        // return leg: flight goes from destination back to departure
        setTicketBookingDate(returnDate);
        navigate(`/book-Flight/${id}`);
      }
    } else {
      navigate('/auth');
    }
  }

  return (
    <div className="landingPage">
      <div className="landingHero">
        <div className="landingHero-title ani-blur-in">
          <h1 className="banner-h1">Embark on an Extraordinary Flight Booking Adventure!</h1>
          <p className="banner-p">Unleash your travel desires and book extraordinary Flight journeys that will transport you to unforgettable destinations, igniting a sense of adventure like never before.</p>
        </div>

        <div className="Flight-search-container glass-panel ani-slide-up" style={{ animationDelay: '0.2s' }}>
          <h3>Journey details</h3>
          <div className="form-check mb-4 d-flex align-items-center gap-3" style={{ paddingLeft: '2.5rem' }}>
            <input className="form-check-input" type="checkbox" id="checkReturnJourney" style={{ cursor: 'pointer', height: '1.25rem', width: '1.25rem', margin: 0 }} checked={checkBox} onChange={(e) => setCheckBox(e.target.checked)} />
            <label className="form-check-label" htmlFor="checkReturnJourney" style={{ color: '#1e293b', fontWeight: '800', cursor: 'pointer', fontSize: '1.05rem', marginTop: '2px' }}>Return journey</label>
          </div>
          
          <div className='Flight-search-container-body'>
            <div className="form-floating">
              <select className="form-select" id="floatingSelectDeparture" value={departure} onChange={(e) => setDeparture(e.target.value)}>
                <option value="">Select origin</option>
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
              <label htmlFor="floatingSelectDeparture">Departure</label>
            </div>

            <div className="form-floating">
              <select className="form-select" id="floatingSelectDestination" value={destination} onChange={(e) => setDestination(e.target.value)}>
                <option value="">Select destination</option>
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
              <label htmlFor="floatingSelectDestination">Destination</label>
            </div>

            <div className="form-floating">
                <input type="date" className="form-control" id="floatingInputstartDate" placeholder=" " value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} />
              <label htmlFor="floatingInputstartDate">Date</label>
            </div>

            {checkBox && (
              <div className="form-floating">
                <input type="date" className="form-control" id="floatingInputreturnDate" placeholder=" " value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
                <label htmlFor="floatingInputreturnDate">Return</label>
              </div>
            )}

            <div style={{ minWidth: 'auto', flex: '0 0 auto' }}>
              <button className="btn btn-primary" style={{ height: '3.5rem', minWidth: '130px', borderRadius: '0.75rem', fontWeight: '800', fontSize: '1.1rem' }} onClick={fetchFlights}>
                Search
              </button>
            </div>
          </div>
          {error && <p className="mt-2" style={{ color: '#fb7185', fontSize: '0.9rem', textAlign: 'left', fontWeight: '500' }}>{error}</p>}
        </div>

        <div ref={resultsRef} style={{ paddingTop: '1rem' }}>
          {Flights.length > 0
            ? (() => {
              const filteredFlights = checkBox
                ? Flights.filter(Flight =>
                  (Flight.origin === departure && Flight.destination === destination) ||
                  (Flight.origin === destination && Flight.destination === departure)
                )
                : Flights.filter(Flight =>
                  Flight.origin === departure && Flight.destination === destination
                );

              return filteredFlights.length > 0 ? (
                <div className="availableFlightsContainer ani-slide-up">
                  <h1>Available Flights</h1>
                  <div className="Flights">
                    {filteredFlights.map((Flight) => (
                      <div className="Flight" key={Flight._id}>
                        <div>
                          <p><b>{Flight.flightName}</b></p>
                          <p><b>Flight Number:</b> {Flight.flightId}</p>
                        </div>
                        <div>
                          <p><b>From:</b> {Flight.origin}</p>
                          <p><b>Departure Time:</b> {Flight.departureTime}</p>
                        </div>
                        <div>
                          <p><b>To:</b> {Flight.destination}</p>
                          <p><b>Arrival Time:</b> {Flight.arrivalTime}</p>
                        </div>
                        <div>
                          <p><b>Starting Price:</b> ₹{Flight.basePrice}</p>
                          <p><b>Available Seats:</b> {Flight.availableSeats}</p>
                        </div>
                        {Flight.availableSeats > 0 ? (
                          <button className="button btn btn-primary" onClick={() => handleTicketBooking(Flight._id, Flight.origin, Flight.destination)}>Book Now</button>
                        ) : (
                          <button className="button btn btn-secondary" disabled>Fully Booked</button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="availableFlightsContainer ani-blur-in">
                  <h1>No Flights Found</h1>
                  <p>No flights available for the selected route and date.</p>
                </div>
              );
            })()
            : <></>
          }
        </div>
      </div>
      <section id="about" className="section-about  p-4">
        <div className="container">
          <h2 className="section-title">About Us</h2>
          <p className="section-description">
            &nbsp; &nbsp;&nbsp; &nbsp; Welcome to our Flight ticket booking app, where we are dedicated to providing you with an exceptional travel experience from start to finish. Whether you're embarking on a daily commute, planning an exciting cross-country adventure, or seeking a leisurely scenic route, our app offers an extensive selection of Flight options to cater to your unique travel preferences.
          </p>
          <p className="section-description">
            &nbsp; &nbsp;&nbsp; &nbsp; We understand the importance of convenience and efficiency in your travel plans. Our user-friendly interface allows you to effortlessly browse through a wide range of Flight schedules, compare fares, and choose the most suitable seating options. With just a few taps, you can secure your Flight tickets and be one step closer to your desired destination. Our intuitive booking process enables you to customize your travel preferences, such as selecting specific departure times, opting for a window seat, or accommodating any special requirements.
          </p>
          <p className="section-description">
            &nbsp; &nbsp;&nbsp; &nbsp; With our Flight ticket booking app, you can embrace the joy of exploring new destinations, immerse yourself in breathtaking scenery, and create cherished memories along the way. Start your journey today and let us be your trusted companion in making your Flight travel dreams a reality. Experience the convenience, reliability, and comfort that our app offers, and embark on unforgettable Flight adventures with confidence.
          </p>

          <span><h5>2023 LR FlightConnect - &copy; All rights reserved</h5></span>

        </div>
      </section>
    </div>
  )
}

export default LandingPage