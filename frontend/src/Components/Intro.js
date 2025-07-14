import React from 'react'
import './Intro.css'
import { Link } from 'react-router-dom'

export default function Intro(props) {
  return (

    <>
      <div className="intro">
        <div className="intro-text">
          <h1>{props.heading}</h1>
          <hr className='heading-hr'/>
          <p>
            {props.first_content}
          <br/>
            {props.second_content}
          </p>
        </div>

        <button className="video-btn">
          <Link to={props.link} className='link'>
            {props.btn_text}
          </Link>
        </button>
      </div>
    </>

  )
}