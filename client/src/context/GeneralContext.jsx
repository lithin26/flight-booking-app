import React, { createContext, useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const GeneralContext = createContext();

const GeneralContextProvider = ({ children }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usertype, setUsertype] = useState('');
  const [ticketBookingDate, setTicketBookingDate] = useState();

  const navigate = useNavigate();

  const inputs = { username, email, usertype, password };

  // ✅ Axios interceptor to attach token to all requests
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      config => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          delete config.headers.Authorization;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    return () => axios.interceptors.request.eject(interceptor);
  }, []);

  // ✅ Auto-logout if token is missing (except on login/register pages)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const currentPath = window.location.pathname;

    const isAuthPage = ['/auth','/'].includes(currentPath);

    if (!token && !isAuthPage) {
      logout(); // Log out and redirect if token is missing
    }
  }, []);

  const login = async () => {
    try {
      const loginInputs = { email, password };
      const res = await axios.post('/login', loginInputs);

      const user = res.data.user;
      const token = res.data.token;

      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id || user._id);
      localStorage.setItem('userType', user.usertype);
      localStorage.setItem('username', user.username);
      localStorage.setItem('email', user.email);

      if (user.usertype === 'customer') {
        navigate('/');
      } else if (user.usertype === 'admin') {
        navigate('/admin');
      } else if (user.usertype === 'flight-operator') {
        navigate('/flight-admin');
      }
    } catch (err) {
      alert("Login failed!!");
      console.log(err);
    }
  };

  const register = async () => {
    try {
      const res = await axios.post('/register', inputs);

      const user = res.data.user;
      const token = res.data.token;

      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id || user._id);
      localStorage.setItem('userType', user.usertype);
      localStorage.setItem('username', user.username);
      localStorage.setItem('email', user.email);

      if (user.usertype === 'customer') {
        navigate('/');
      } else if (user.usertype === 'admin') {
        navigate('/admin');
      } else if (user.usertype === 'flight-operator') {
        navigate('/flight-admin');
      }
    } catch (err) {
      alert("Registration failed!!");
      console.log(err);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/'); // redirect to login page
    window.location.reload(); // optional: forces state reset
  };

  return (
    <GeneralContext.Provider
      value={{
        login,
        register,
        logout,
        username,
        setUsername,
        email,
        setEmail,
        password,
        setPassword,
        usertype,
        setUsertype,
        ticketBookingDate,
        setTicketBookingDate
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
};

export default GeneralContextProvider;
