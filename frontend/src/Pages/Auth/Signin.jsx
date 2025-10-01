import React, { useState, useEffect } from 'react';
import './Signin.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth0 } from "@auth0/auth0-react";
import { useAuth } from '../../contexts/AuthContext';

const Signin = () => {
  const { loginWithRedirect } = useAuth0();
  const { login, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(form.email, form.password);
    
    if (result.success) {
      toast.success('✅ Login successful');
      navigate('/home');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <h2>Welcome Back</h2>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit">Sign In</button>
        <p className="switch-link" onClick={() => navigate('/signup')}>
          Don’t have an account? <span>Sign Up</span>
        </p>
        <p className="switch-link"onClick={() => loginWithRedirect()}>
          <img src="/google.png" alt="Google" width="30px" height="30px" />
          Continue with Google
        </p>
      </form>

      
    </div>
  );
};

export default Signin;
