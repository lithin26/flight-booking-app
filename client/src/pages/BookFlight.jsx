import React, { useContext, useEffect, useState } from 'react'
import '../styles/BookFlight.css'
import { GeneralContext } from '../context/GeneralContext';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const BookFlight = () => {
    const {id} = useParams();
    const [flightName, setFlightName] = useState('');
    const [flightId, setFlightId] = useState('');
    const [basePrice, setBasePrice] = useState(0);
    const [StartCity, setStartCity] = useState('');
    const [destinationCity, setDestinationCity] = useState('');
    const [startTime, setStartTime] = useState();
    const [arrivalTimeState, setArrivalTimeState] = useState();
    useEffect(()=>{
      fetchFlightData();
    }, [])
  
    const fetchFlightData = async () => {
      try {
        const response = await axios.get(`/fetch-flight/${id}`);
        setFlightName(response.data.flightName);
        setFlightId(response.data.flightId);
        setBasePrice(response.data.basePrice);
        setStartCity(response.data.origin);
        setDestinationCity(response.data.destination);
        setStartTime(response.data.departureTime);
        setArrivalTimeState(response.data.arrivalTime);
      } catch (err) {
        console.error('Error fetching flight data:', err);
        alert('Could not load flight details. Please go back and try again.');
      }
    }
  
  
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [coachType, setCoachType] = useState('');
    const {ticketBookingDate} = useContext(GeneralContext);
    const [journeyDate, setJourneyDate] = useState(ticketBookingDate);
  
    const [numberOfPassengers, setNumberOfPassengers] = useState(0);
    const [passengerDetails, setPassengerDetails] = useState([]);
  
    const [totalPrice, setTotalPrice] = useState(0);
    const price = {'economy': 1, 'premium-economy': 2, 'business': 3, 'first-class': 4}
    

    const handlePassengerChange = (event) => {
      const value = parseInt(event.target.value);
      if (!isNaN(value) && value >= 0) {
        setNumberOfPassengers(value);
      } else if (event.target.value === '') {
        setNumberOfPassengers(0);
      }
    };
    const handlePassengerDetailsChange = (index, key, value) => {
      setPassengerDetails((prevDetails) => {
        const updatedDetails = [...prevDetails];
        updatedDetails[index] = { ...updatedDetails[index], [key]: value };
        return updatedDetails;
      });
      
    };
  
    useEffect(()=>{
      if(price[coachType] && basePrice && numberOfPassengers){
        setTotalPrice(price[coachType] * basePrice * numberOfPassengers);
      } else {
        setTotalPrice(0);
      }
    },[numberOfPassengers, coachType, basePrice])
  
  
    const navigate = useNavigate();
  
  
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };
  
    const bookFlight = async ()=>{
      if (!email || !mobile || !coachType || numberOfPassengers === 0 || passengerDetails.length !== numberOfPassengers || passengerDetails.some(p => !p || !p.name || !p.age)) {
          alert("Please fill all required fields correctly.");
          return;
      }
      const d = new Date(journeyDate);
      const today = new Date();
      today.setHours(0,0,0,0);
      if (d < today) {
          alert("Journey date cannot be in the past.");
          return;
      }
  
      const res = await loadRazorpayScript();
      if (!res) {
        alert('Payment system failed to load. Please check your connection.');
        return;
      }

      try {
        // Enforce integer amount for safety
        const paymentAmount = Math.round(totalPrice);

        const orderResponse = await axios.post('/create-razorpay-order', {
          amount: paymentAmount
        });
        const order = orderResponse.data;

        if (!order || !order.id) {
          throw new Error("Invalid order data received from server");
        }

        const options = {
          key: "rzp_test_SZHA97faCPlVc9", // Ensure this matches your RAZORPAY_KEY_ID in .env
          amount: order.amount,
          currency: "INR",
          name: "Flight Booking Platform",
          description: `Flight Reservation: ${flightName} (${flightId})`,
          order_id: order.id,
          handler: async function (response) {
            try {
              const verifyUrl = '/verify-razorpay-payment';
              const { data } = await axios.post(verifyUrl, {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });

              if (data.message === "Payment successfully verified") {
                const inputs = {
                  user: localStorage.getItem('userId'), flight: id, flightName, 
                  flightId, departure: StartCity, journeyTime: startTime, arrivalTime: arrivalTimeState, destination: destinationCity, 
                  email, mobile, passengers: passengerDetails, totalPrice: paymentAmount, 
                  journeyDate, seatClass: coachType,
                  paymentId: data.paymentId,
                  paymentStatus: "completed"
                }; 
                
                await axios.post('/book-ticket', inputs).then(
                  (response)=>{
                    alert("✅ Booking & Payment Successful!");
                    navigate('/bookings');
                  }
                ).catch((err)=>{
                  console.error("Post-payment booking failure:", err);
                  alert("⚠️ Payment was successful but booking record failed! Please contact support with ID: " + data.paymentId);
                })
              }
            } catch (verifyError) {
              console.error("Verification error:", verifyError);
              alert('⚠️ Payment verification failed. Please check your bank statement before trying again.');
            }
          },
          prefill: {
            name: passengerDetails[0]?.name || "Customer",
            email: email || "",
            contact: mobile || "",
          },
          theme: {
            color: "#1c527e", // Matches your navbar brand color
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();

      } catch (err) {
        console.error("Payment initialization failed:", err);
        const errorMsg = err.response?.data?.message || "Could not initialize payment. Please try again later.";
        alert(errorMsg);
      }
    }
  
  
  
    
  
    return (
      <div className='BookFlightPage'>
        <div className="BookingFlightPageContainer ani-slide-up">
          <h2>Create Passenger Manifest</h2>
          
          <div className="flight-briefing">
              <div className="briefing-item">
                  <p>Flight Service</p>
                  <b>{flightName}</b>
              </div>
              <div className="briefing-item">
                  <p>Aircraft ID</p>
                  <b>{flightId}</b>
              </div>
              <div className="briefing-item">
                  <p>Route</p>
                  <b>{StartCity} → {destinationCity}</b>
              </div>
              <div className="briefing-item" style={{textAlign: 'right'}}>
                  <p>Base Listing</p>
                  <b>₹{basePrice}</b>
              </div>
          </div>
        
          <div className="form-row">
            <div className="form-floating">
                  <input type="email" className="form-control" id="floatingInputemail" placeholder="email" value={email} onChange={(e)=> setEmail(e.target.value)} />
                  <label htmlFor="floatingInputemail">Notification Email</label>
            </div>
            <div className="form-floating">
                  <input type="text" className="form-control" id="floatingInputmobileBook" placeholder="mobile" value={mobile} onChange={(e)=> setMobile(e.target.value)} />
                  <label htmlFor="floatingInputmobileBook">Technical Contact</label>
            </div>
          </div>

          <div className="form-row-tri" style={{ gridTemplateColumns: '1fr 1fr 1fr', display: 'grid', gap: '1.25rem', marginBottom: '2rem'}}>
            <div className="form-floating">
                  <input type="number" min="1" className="form-control" id="floatingInputPassengers" placeholder="0" value={numberOfPassengers} onChange={handlePassengerChange} />
                  <label htmlFor="floatingInputPassengers">Passenger Count</label>
            </div>
            <div className="form-floating">
                  <input type="date" className="form-control" id="floatingInputJourneyDate"
                    placeholder="date"
                    value={journeyDate || ''}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setJourneyDate(e.target.value)} />
                  <label htmlFor="floatingInputJourneyDate">Boarding Date</label>
            </div>
            <div className="form-floating">
                  <select className="form-select" id="floatingSelect" defaultValue="" value={coachType} onChange={(e) => setCoachType(e.target.value) }>
                    <option value="">Select Cabin</option>
                    <option value="economy">Economy</option>
                    <option value="premium-economy">Premium</option>
                    <option value="business">Business</option>
                    <option value="first-class">First Class</option>
                  </select>
                  <label htmlFor="floatingSelect">Travel Class</label>
            </div>
          </div>
  
          <div className="new-passengers">
              {Array.from({ length: numberOfPassengers }).map((_, index) => (
                <div className='new-passenger' key={index} style={{ animationDelay: `${0.1 + (index * 0.1)}s` }}>
                  <h4>Passenger {index + 1}</h4>
                  <div className="new-passenger-inputs">
                      <div className="form-floating">
                        <input type="text" className="form-control" placeholder="name" id={`floatingInputpassengerName${index}`} value={passengerDetails[index]?.name || ''} onChange={(event) => handlePassengerDetailsChange(index, 'name', event.target.value) } />
                        <label htmlFor={`floatingInputpassengerName${index}`}>Full Legal Name</label>
                      </div>
                      <div className="form-floating">
                            <input type="number" className="form-control" placeholder="age" id={`floatingInputpassengerAge${index}`} value={passengerDetails[index]?.age || ''} onChange={(event) => handlePassengerDetailsChange(index, 'age', event.target.value) } />
                            <label htmlFor={`floatingInputpassengerAge${index}`}>Age</label>
                      </div>
                  </div>
                </div>
              ))}
          </div>
          
          <div style={{ marginTop: '3rem', textAlign: 'center', borderTop: '2px solid #f1f5f9', paddingTop: '2rem' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '600' }}>Aggregated Fare</div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#0f172a' }}>₹{totalPrice}</div>
              <button className='btn btn-primary' onClick={bookFlight}>Initialize Payment & Book</button>
          </div>
        </div>
      </div>
    )
  }
export default BookFlight