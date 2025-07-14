import React from 'react'
import './Footer.css'
import { SocialIcon } from 'react-social-icons'
export default function Footer() {
  return (
    <>
      <hr className="footer-hr" />
      <div className='footer'>
        <div className="footer-logo">
          <img src='/img/shape.svg' width="100px" height="100px" alt="logo"/><span className="footer-span">Video Generator</span>
        </div>

        <ul className='d-flex'>
          <li className='footer-nav'><SocialIcon network="whatsapp" url="https://wa.me/+923030751057?text=Hi,%20I%20found%20your%20contact%20through%20your%20website!" /></li>
          <li className='footer-nav'><SocialIcon network="facebook" url="https://www.facebook.com/awais.rasheed.7543" /></li>
          <li className='footer-nav'><SocialIcon network="linkedin" url="https://www.linkedin.com/in/awaisalirasheed" /></li>
          <li className='footer-nav'><SocialIcon network="github" url="https://github.com/Awais-Rasheed" /></li>
          <li className='footer-nav'><SocialIcon network="google" url="mailto:dev.awaisrasheed@gmail.com" /></li>
        </ul>
      </div>
    </>
  )
}
