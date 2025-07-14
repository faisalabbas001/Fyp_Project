import React, { useState } from 'react';
import './Signin.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth0 } from "@auth0/auth0-react";
const Signin = () => {
  const { loginWithRedirect } = useAuth0();
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user)); 
      toast.success('✅ Login successful');
      navigate('/home');
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Login failed');
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
