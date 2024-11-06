import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Assesment from './pages/assesment/Assesment'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/assessment" element={<Assesment />} />

      </Routes>

    </Router>
  )
}

export default App
