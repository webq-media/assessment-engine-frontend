import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Assesment from './pages/assesment/Assesment'
import DirectUpload from './pages/DirectUpload/DirectUpload';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/assessment" element={<Assesment />} />
        <Route path="/directUpload" element={<DirectUpload />} />


      </Routes>

    </Router>
  )
}

export default App
