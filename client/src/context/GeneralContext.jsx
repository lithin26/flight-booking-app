import React, { createContext, useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const GeneralContext = createContext();

const GeneralContextProvider = ({ children }) => {
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [email, setEmail] = useState(localStorage.getItem('email') || '');
  const [password, setPassword] = useState('');
  const [usertype, setUsertype] = useState(localStorage.getItem('userType') || '');
  const [ticketBookingDate, setTicketBookingDate] = useState();
  const [isAuthLoading, setIsAuthLoading] = useState(false);

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

  // ✅ Auto-logout if token is missing (except on login/register/landing pages)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const currentPath = window.location.pathname;
    const isAuthPage = ['/auth', '/', '/login', '/register'].includes(currentPath);

    if (!token && !isAuthPage) {
      // Small delay to prevent race conditions during page load
      const timeout = setTimeout(() => {
        if (!localStorage.getItem('token')) {
          logout();
        }
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, []);

  const login = async () => {
    if (isAuthLoading) return;
    setIsAuthLoading(true);
    try {
      const loginInputs = { email, password };
      const res = await axios.post('/login', loginInputs);

      if (res.data && res.data.token) {
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
      }
    } catch (err) {
      if (err.response) {
          alert(`Login failed: ${err.response.data.message || 'Invalid Credentials'}`);
      } else {
          console.error("Login Context Error:", err);
      }
    } finally {
        setIsAuthLoading(false);
    }
  };

  const register = async () => {
    if (isAuthLoading) return;
    setIsAuthLoading(true);
    try {
      const res = await axios.post('/register', inputs);

      if (res.data && res.data.token) {
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
      }
    } catch (err) {
      if (err.response) {
          alert(`Registration failed: ${err.response.data.message || 'Error occurred'}`);
      } else {
          console.error("Registration Context Error:", err);
      }
    } finally {
        setIsAuthLoading(false);
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
        setTicketBookingDate,
        isAuthLoading
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
};

export default GeneralContextProvider;
