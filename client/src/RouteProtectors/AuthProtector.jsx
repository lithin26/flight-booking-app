import { Navigate } from 'react-router-dom';

const AuthProtector = ({ children }) => {
  const userType = localStorage.getItem('userType');
  const token = localStorage.getItem('token');

  // If not logged in at all, redirect to auth page
  if (!userType || !token) {
    return <Navigate to='/' replace />;
  }

  return children;
};

export default AuthProtector;