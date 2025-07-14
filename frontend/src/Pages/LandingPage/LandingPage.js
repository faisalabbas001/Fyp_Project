import React from 'react';
import './LandingPage.css';
import { useAuth0 } from "@auth0/auth0-react";
import Footer from '../../Components/Footer';
import { Collapse } from "antd";
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
// Define styled components
const StyledCollapse = styled(Collapse)`
  .ant-collapse-header {
    color: white !important; 
    font-size: 3rem;
    text-align:center; 
  }

  .ant-collapse-content {
    color: white;
    font-size: 16px; 
  }
`;

export default function LandingPage() {
  const { loginWithRedirect } = useAuth0();
  const navigate = useNavigate();
  const text_generator_text = `
    Our Text generator uses state-of-the-art artificial intelligence algorithms to generate text from your input. Whether you need promotional text, educational content, or anything in between, our AI is here to help.;
    Get started by entering your prompt and let our AI work its magic to generate helpful text for you.
  `;

  const image_generator_text = `
    Our image generator uses state-of-the-art artificial intelligence algorithms to create stunning Images from your input. Whether you need promotional images, educational content, or anything in between, our AI is here to help.
    Get started by entering your prompt and let our AI work its magic to generate beautiful images for you.
  `;

  return (
    <>
      <div className='landing-page'></div>

      <div className="landing-page-body">
        <div className="landing-navbar">
          <div className='video_logo'>
            <img src="/img/shape.svg" className="Landing_logo" alt="Logo" width="100px" height="100px" />
          </div>
          <div className='nav-links'>
            <ul>
              <li className="nav-items"><button className='btn btn-primary' onClick={() => navigate('/signin')}>Sign In</button></li>
            </ul>
          </div>
        </div>

        <div className="banner">
          <h1 className='gradient-text video-logo-heading'>Video Generator</h1>
          <h1 className="banner-text">TURN YOUR <span className="gradient-text">IMAGINATIONS</span><br /> INTO VIDEOS</h1>
          <button className="start-btn" onClick={() => navigate('/signin')}>Get Started</button>
        </div>

        <div className="services">
          <div className="video-generator-section">
            <StyledCollapse size='large' ghost
              items={[
                {
                  key: '1',
                  label: 'Video Generator',
                  children: <p>{text_generator_text}</p>,
                  showArrow: false,
                },
              ]}
            />
            <video autoplay="true" loop muted>
              <source src="/img/Product_003.webm" type="video/webm" />
            </video>
          </div>

          <div className="text-generator-section">
            <StyledCollapse size='large' ghost
              items={[
                {
                  key: '1',
                  label: 'Text Generator',
                  children: <p>{text_generator_text}</p>,
                  showArrow: false,
                },
              ]}
            />
            <video autoplay="true" loop muted>
              <source src="/img/curlFinal.mp4" type="video/mp4" />
            </video>
          </div>

          <div className="image-generator-section">
            <StyledCollapse size='large' ghost
              items={[
                {
                  key: '1',
                  label: 'Image Generator',
                  children: <p>{image_generator_text}</p>,
                  showArrow: false,
                },
              ]}
            />
            <img src='/img/Structured_Outputs_Cover.webp' alt='services' />
            <img src='/img/dall-e.webp' alt='services' />
          </div>
        </div>

        <Footer />
      </div>
    </>
  )
}
