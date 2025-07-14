import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home/Home';
import Generator from './Pages/Text_generator/Generator';
import ImageGenerator from './Pages/Image_generator/ImageGenerator';
import ImageAnalyzer from './Pages/Image_analyzer/ImageAnalyzer';
import LandingPage from './Pages/LandingPage/LandingPage';
import Video from './Video';
import VideoGenerator from './Pages/Video_Generator/VideoGenerator';
import Signup from "./Pages/Auth/Signup";
import Signin from './Pages/Auth/Signin';
import PrivateRoute from './PrivateRoute'; // ✅ Add this

export default function App_Routes() {
  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />

      {/* 🔐 PROTECTED ROUTES */}
      <Route
        path="/home"
        element={<PrivateRoute><Home /></PrivateRoute>}
      />
      <Route
        path="/generator"
        element={<PrivateRoute><Generator /></PrivateRoute>}
      />
      <Route
        path="/image_generator"
        element={<PrivateRoute><ImageGenerator /></PrivateRoute>}
      />
      <Route
        path="/analyzer"
        element={<PrivateRoute><ImageAnalyzer /></PrivateRoute>}
      />
      <Route
        path="/video"
        element={<PrivateRoute><VideoGenerator /></PrivateRoute>}
      />
      <Route
        path="/new"
        element={<PrivateRoute><Video /></PrivateRoute>}
      />

      {/* Public landing page */}
      <Route path="/" element={<LandingPage />} />
    </Routes>
  );
}
