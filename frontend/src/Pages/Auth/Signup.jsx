import React, { useState, useEffect } from 'react';
import './Signup.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth0 } from "@auth0/auth0-react";
import { useAuth } from '../../contexts/AuthContext';

const Signup = () => {
  const { loginWithRedirect } = useAuth0();
  const { signup, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    const result = await signup(form.username, form.email, form.password);
    
    if (result.success) {
      toast.success('✅ Signup successful');
      navigate('/signin');
    } else {
      toast.error(result.error);
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

        <button
  type="button"
  className="google-btn"
  onClick={() => loginWithRedirect()}
>
  <img src="/google.png" alt="Google" width="30px" height="30px" />
  Continue with Google
</button>

      </form>
    </div>
  );
};

export default Signup;
