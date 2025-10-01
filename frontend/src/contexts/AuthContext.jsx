import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const { user: auth0User, isAuthenticated: auth0IsAuthenticated, isLoading: auth0Loading, getAccessTokenSilently } = useAuth0();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Handle Auth0 authentication
  useEffect(() => {
    const handleAuth0Login = async () => {
      if (auth0IsAuthenticated && auth0User) {
        try {
          // Get Auth0 access token
          const accessToken = await getAccessTokenSilently();
          
          // Create user object compatible with your backend
          const userData = {
            id: auth0User.sub,
            username: auth0User.nickname || auth0User.name,
            email: auth0User.email,
            provider: 'google'
          };

          // Store in localStorage
          localStorage.setItem('token', accessToken);
          localStorage.setItem('user', JSON.stringify(userData));
          
          // Update state
          setToken(accessToken);
          setUser(userData);
        } catch (error) {
          console.error('Error getting Auth0 token:', error);
        }
      }
    };

    if (!auth0Loading) {
      if (auth0IsAuthenticated) {
        handleAuth0Login();
      } else {
        // Check for existing custom auth token
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      }
      setLoading(false);
    }
  }, [auth0IsAuthenticated, auth0User, auth0Loading, getAccessTokenSilently]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      
      const { token: newToken, user: userData } = response.data;
      
      // Store in localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Update state
      setToken(newToken);
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.msg || 'Login failed' 
      };
    }
  };

  const signup = async (username, email, password) => {
    try {
      await axios.post('http://localhost:5000/api/auth/signup', {
        username,
        email,
        password
      });
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.msg || 'Signup failed' 
      };
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear state
    setToken(null);
    setUser(null);
    
    // If user was logged in via Auth0, logout from Auth0 as well
    if (auth0IsAuthenticated) {
      window.location.href = `https://dev-a2ozvfuacpfd0qu3.us.auth0.com/v2/logout?returnTo=${encodeURIComponent(window.location.origin)}`;
    }
  };

  const isAuthenticated = () => {
    return !!token && !!user;
  };

  const value = {
    user,
    token,
    loading: loading || auth0Loading,
    login,
    signup,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
