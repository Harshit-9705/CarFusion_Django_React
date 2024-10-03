import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup'; 
import UserProfilePage from './components/Profile';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CarRegistration from './components/CarForm';
import CarDetailPage from './components/CarInfo';
import HomePage from './components/Home';
import CarUpdatePage from './components/CarUpdate';
import LikedCars from './components/LikedCar';
import CarListingPage from './components/CarListingPage';
import NotFound from './components/NotFound';

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/profile" element={<UserProfilePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/car-register" element={<CarRegistration />} />
                <Route path="/cars/:id" element={<CarDetailPage />} />
                <Route path="/car/:id" element={<CarUpdatePage />} />
                <Route path="/liked-car" element={<LikedCars />} />
                <Route path="/car-list" element={<CarListingPage />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
        </Router>
    );
};

export default App;
