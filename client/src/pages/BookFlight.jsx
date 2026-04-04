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
        alert('Razorpay SDK failed to load. Are you online?');
        return;
      }

      try {
        const orderResponse = await axios.post('/create-razorpay-order', {
          amount: totalPrice
        });
        const order = orderResponse.data;

        const options = {
          key: "rzp_test_SZHA97faCPlVc9", 
          amount: order.amount,
          currency: "INR",
          name: "Flight Booking Platform",
          description: `Tickets exactly for ${flightName}`,
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
                  flightId, departure: StartCity, journeyTime: startTime, destination: destinationCity, 
                  email, mobile, passengers: passengerDetails, totalPrice, 
                  journeyDate, seatClass: coachType,
                  paymentId: data.paymentId,
                  paymentStatus: "completed"
                }; 
                
                await axios.post('/book-ticket', inputs).then(
                  (response)=>{
                    alert("Booking & Payment Successful!");
                    navigate('/bookings');
                  }
                ).catch((err)=>{
                  alert("Booking tracking failed! Support has been notified.");
                })
              }
            } catch (verifyError) {
              console.error(verifyError);
              alert('Payment Verification Failed!');
            }
          },
          prefill: {
            name: "Customer",
            email: email,
            contact: mobile,
          },
          theme: {
            color: "#3399cc",
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();

      } catch (err) {
        console.error("Order creation failed", err);
        alert("Could not initialize payment. Ensure server has Razorpay credentials configured.");
      }
    }
  
  
  
    
  
    return (
      <div className='BookFlightPage'>
  
        <div className="BookingFlightPageContainer">
          <h2>Book ticket</h2>
        <span>
          <p><b>Flight Name: </b> {flightName}</p>
          <p><b>Flight No: </b> {flightId}</p>
        </span>
        <span>
          <p><b>From: </b> {StartCity} → <b>To: </b> {destinationCity}</p>
          <p><b>Base price: </b> ₹{basePrice}</p>
        </span>
        
        <span>
          <div className="form-floating mb-3">
                  <input type="email" className="form-control" id="floatingInputemail" value={email} onChange={(e)=> setEmail(e.target.value)} />
                  <label htmlFor="floatingInputemail">Email</label>
            </div>
            <div className="form-floating mb-3">
                  <input type="text" className="form-control" id="floatingInputmobile" value={mobile} onChange={(e)=> setMobile(e.target.value)} />
                  <label htmlFor="floatingInputmobile">Mobile</label>
            </div>
        </span>
        <span className='span3'>
          <div className="no-of-passengers">
            <div className="form-floating mb-3">
                  <input type="number" min="1" className="form-control" id="floatingInputPassengers" value={numberOfPassengers} onChange={handlePassengerChange} />
                  <label htmlFor="floatingInputPassengers">No of passengers</label>
            </div>
          </div>
          <div className="form-floating mb-3">
                  <input type="date" className="form-control" id="floatingInputJourneyDate"
                    value={journeyDate || ''}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setJourneyDate(e.target.value)} />
                  <label htmlFor="floatingInputJourneyDate">Journey date</label>
          </div>
          <div className="form-floating">
                        <select className="form-select form-select-sm mb-3" id="floatingSelect" defaultValue="" aria-label=".form-select-sm example" value={coachType} onChange={(e) => setCoachType(e.target.value) }>
                          <option value=""selected>Select</option>
                          <option value="economy">Economy class</option>
                          <option value="premium-economy">Premium Economy</option>
                          <option value="business">Business class</option>
                          <option value="first-class">First class</option>
                        </select>
                        <label htmlFor="floatingSelect">Seat Class</label>
                      </div>
  
        </span>
  
        <div className="new-passengers">
            {Array.from({ length: numberOfPassengers }).map((_, index) => (
              <div className='new-passenger' key={index}>
                <h4>Passenger {index + 1}</h4>
                <div className="new-passenger-inputs">
  
                    <div className="form-floating mb-3">
                      <input type="text" className="form-control" id={`floatingInputpassengerName${index}`} value={passengerDetails[index]?.name || ''} onChange={(event) => handlePassengerDetailsChange(index, 'name', event.target.value) } />
                      <label htmlFor={`floatingInputpassengerName${index}`}>Name</label>
                    </div>
                    <div className="form-floating mb-3">
                          <input type="number" className="form-control" id={`floatingInputpassengerAge${index}`} value={passengerDetails[index]?.age || ''} onChange={(event) => handlePassengerDetailsChange(index, 'age', event.target.value) } />
                          <label htmlFor={`floatingInputpassengerAge${index}`}>Age</label>
                    </div>
                    
  
                </div>
              </div>
            ))}
  
        </div>
        
        <h6><b>Total price</b>: ₹{totalPrice}</h6>
        <button className='btn btn-primary' onClick={bookFlight}>Pay & Book</button>
      </div>
      </div>
    )
  }
export default BookFlight