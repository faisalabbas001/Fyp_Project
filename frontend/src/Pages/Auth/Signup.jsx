import React, { useState } from 'react';
import './Signup.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth0 } from "@auth0/auth0-react";

const Signup = () => {
    const { loginWithRedirect } = useAuth0();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/signup', form);
      toast.success('✅ Signup successful');
      navigate('/signin');
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Signup failed');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSignup}>
        <h2>Create Your Account</h2>
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
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
        <button type="submit">Sign Up</button>
        <p className="switch-link" onClick={() => navigate('/signin')}>
          Already have an account? <span>Sign In</span>
        </p>

        <p className="switch-link"onClick={() => loginWithRedirect()}>
          <img src="/google.png" alt="Google" width="30px" height="30px" />
          Continue with Google
        </p>
      </form>
    </div>
  );
};

export default Signup;
