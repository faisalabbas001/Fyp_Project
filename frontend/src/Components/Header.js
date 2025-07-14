import React, { useEffect, useRef, useState } from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
export default function Header() {
  const [user, setUser] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser); // ✅ Correctly parsed user
    } else {
      navigate('/signin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logout successfully');
    navigate('/signin');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className='header'>
      <div className='title'>
        <h1 className='header-heading'>Video Generator</h1>
      </div>

      {user && (
        <div className="user-section" ref={dropdownRef}>
          <button
            className="user-btn"
            onClick={() => setDropdownVisible(!dropdownVisible)}
          >
            👤 {user.username}
          </button>

          {dropdownVisible && (
            <div className="dropdown">
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <button className="logout-dropdown-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
