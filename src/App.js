import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'; // <-- Import the new Home page
import Register from './pages/Register';
import Login from './pages/Login';
import Verify from './pages/Verify';
import ProductDetail from './pages/ProductDetail';
import Search from './pages/Search';

function App() {
  return (
    <Router>
      <Routes>
        {/* Make the root URL point to the Home page */}
        <Route path="/" element={<Home />} />
        
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </Router>
  );
}

export default App;