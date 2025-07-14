import React, { useEffect } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import Intro from "../../Components/Intro";
import "./Home.css";
import AOS from "aos";
import "aos/dist/aos.css";

import Data from "../../util/Data.json";

AOS.init({
  once: false,
});

export default function Home() {

  return (
    <>
     
        <div className="home-main">
          <Header />
          <div className="section mobile-body">
            <div className="image">
              <img
                className="shape-gif img-fluid"
                data-aos="fade-in-left"
                data-aos-duration="2000"
                data-aos-easing="ease-in-out"
                src="img/Video_generator.gif"
                alt="Video Generator"
              />
            </div>

            <Intro
              btn_text="Video Generator"
              link="/video"
              heading={Data.HomePage_Data.video_generator_heading}
              first_content={Data.HomePage_Data.video_generator_first_content}
              second_content={Data.HomePage_Data.video_generator_second_content}
            />


          </div>

          <div className="section mobile-body">
            <Intro
              btn_text="Text Generator"
              link="/generator"
              heading={Data.HomePage_Data.text_generator_heading}
              first_content={Data.HomePage_Data.text_generator_first_content}
              second_content={Data.HomePage_Data.text_generator_second_content}
            />

            <div className="image">
              <img
                className="shape-gif img-fluid"
                data-aos="fade-in-left"
                data-aos-duration="2000"
                data-aos-easing="ease-in-out"
                src="img/giphy.gif"
                alt="Logo"
              />
            </div>
          </div>

          <div className="section">
            <div className="image">
              <img
                className="shape"
                data-aos="fade-right"
                data-aos-duration="2000"
                data-aos-easing="ease-in-out"
                src="img/shape.svg"
                alt="Logo"
              />
            </div>

            <Intro
              btn_text="Image Generator"
              link="/image_generator"
              heading={Data.HomePage_Data.image_generator_heading}
              first_content={Data.HomePage_Data.image_generator_first_content}
              second_content={Data.HomePage_Data.image_generator_second_content}
            />
          </div>

          <div className="section analyzer-section mobile-body">
            <Intro
              btn_text="Image Analyzer"
              link="/analyzer"
              heading={Data.HomePage_Data.image_analyzer_heading}
              first_content={Data.HomePage_Data.image_analyzer_first_content}
              second_content={Data.HomePage_Data.image_analyzer_second_content}
            />

            <div className="image">
              <img
                className="gif img-fluid"
                data-aos="fade-left"
                data-aos-duration="1000"
                data-aos-easing="ease-in-out"
                src="img/74pZ.gif"
                alt="Logo"
                width="80%"
                height="70%"
              />
            </div>
          </div>

          <Footer />
        </div>
      
    </>
  );
}
