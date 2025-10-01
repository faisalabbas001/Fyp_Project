import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="error-code">404</div>
        <h1 className="error-title">Oops! Page Not Found</h1>
        <p className="error-message">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="error-actions">
          <button onClick={handleGoBack} className="btn-secondary">
            ← Go Back
          </button>
          <button onClick={handleGoHome} className="btn-primary">
            🏠 Go Home
          </button>
        </div>
        <div className="error-suggestions">
          <p>You might be looking for:</p>
          <ul>
            <li><a href="/home">Home Dashboard</a></li>
            <li><a href="/generator">Text Generator</a></li>
            <li><a href="/image_generator">Image Generator</a></li>
            <li><a href="/analyzer">Image Analyzer</a></li>
            <li><a href="/video">Video Generator</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
