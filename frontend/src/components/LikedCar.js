import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaHeart, FaGasPump, FaUser, FaTachometerAlt } from 'react-icons/fa';
import axiosInstance from './axiosInstance';
import { useNavigate } from 'react-router-dom';

const LikedCars = () => {
    const [likedCars, setLikedCars] = useState([]);
    const [alertError, setAlertError] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const navigate = useNavigate()
    useEffect(()=>{
        if(!localStorage.getItem("token")){
            navigate("/login")
        }
    })

    useEffect(() => {
        const fetchLikedCars = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setAlertError('Please log in to see liked cars.');
                return;
            }

            try {
                const response = await axiosInstance.get('/liked-cars/');
                setLikedCars(response.data);
            } catch (error) {
                console.error('Error fetching liked cars:', error);
                setAlertError(error.response.data.detail);
            }
        };

        fetchLikedCars();
    }, []);


    useEffect(() => {
        let timer;
        if (alertMessage || alertError) {
            timer = setTimeout(() => {
                setAlertMessage('');
                setAlertError('');
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [alertMessage, alertError]);

    const handleRemoveCar = async (carId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setAlertError("Please log in to remove liked cars.");
            return;
        }

        try {
            await axiosInstance.delete(`/liked-cars/${carId}/`);
            setLikedCars(likedCars.filter(car => car.id !== carId));
            setAlertMessage("Car removed from liked cars successfully.");
        } catch (error) {
            setAlertError('Error removing liked car. Please try again later.');
            console.error('Error removing liked car:', error);
        }
    };

    return (
        <div
            className="flex flex-col"
            style={{
                background: 'radial-gradient(circle, #2C2C2C 0%, #3A3A3A 40%, #333333 75%, #222222 100%)',
                minHeight: '100vh'
            }}
        >
            {alertMessage && (
                <div className="bg-green-700 z-10 text-white p-4 fixed top-20 left-1/2 transform -translate-x-1/2 w-11/12 max-w-lg rounded-lg shadow-md flex items-center mb-4">
                    <span className="mr-2">✅</span>
                    <span>{alertMessage}</span>
                </div>
            )}

            {alertError && (
                <div className="bg-red-700 z-10 text-white p-4 fixed top-20 left-1/2 transform -translate-x-1/2 w-11/12 max-w-lg rounded-lg shadow-md flex items-center mb-4">
                    <span className="mr-2">❌</span>
                    <span>{alertError}</span>
                </div>
            )}

            <div className="w-full p-4">
                <div className="p-16">
                    <h2 className="font-bold mb-4 text-blue-600 text-center text-5xl">Liked Cars</h2>
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                    {likedCars.length > 0 ? (
                        likedCars.map(likedCar => (
                            <div key={likedCar.id} className="w-full sm:w-1/2 md:w-1/3">
                                <div className="featured-car-card mb-14 w-full bg-[#2A2A2A] hover:bg-transparent hover:shadow-none rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-95 duration-200">
                                    <figure className="card-banner">
                                        <img
                                            src={`http://127.0.0.1:8000${likedCar.car.image}`}
                                            alt={`${likedCar.car.make} ${likedCar.car.model}`}
                                            className="w-full h-64 rounded-lg"
                                        />
                                    </figure>

                                    <div className="card-content p-4 w-full">
                                        <div className="card-title-wrapper flex justify-between items-center mb-2">
                                            <h3 className="h3 card-title">
                                                <a href={`/cars/${likedCar.car.id}`} className="text-lg font-semibold text-gray-300 hover:text-gray-400 transition duration-200">
                                                    {`${likedCar.car.make} ${likedCar.car.model}`}
                                                </a>
                                            </h3>
                                            <data className="year text-gray-500" value={likedCar.car.year}>{likedCar.car.year}</data>
                                        </div>

                                        <ul className="card-list list-none mb-4">
                                            <li className="card-list-item flex items-center mb-1">
                                                <FaMapMarkerAlt className="mr-2 text-blue-500" />
                                                <span className="card-item-text text-gray-300">{`${likedCar.car.location}`}</span>
                                            </li>
                                            <li className="card-list-item flex items-center mb-1">
                                                <FaGasPump className="mr-2 text-blue-500" />
                                                <span className="card-item-text text-gray-300">{likedCar.car.fuel_type}</span>
                                            </li>
                                            <li className="card-list-item flex items-center mb-1">
                                                <FaTachometerAlt className="mr-2 text-blue-500" />
                                                <span className="card-item-text text-gray-300">{`${likedCar.car.mileage} km`}</span>
                                            </li>
                                        </ul>

                                        <div className="card-price-wrapper flex items-center justify-between mt-4">
                                            <p className="card-price text-lg font-bold text-blue-500">
                                                <strong>${likedCar.car.price.toLocaleString()}</strong>
                                            </p>

                                            <div className="flex gap-3">
                                            <button
                                                className={`flex items-center p-2 rounded text-white transition duration-200 bg-blue-600 hover:bg-blue-800 shadow-md transform hover:scale-105`}
                                                onClick={() => handleRemoveCar(likedCar.id)}
                                            >
                                                Remove Car 
                                            </button>
                                            <a
                                                className={`flex items-center p-2 rounded text-white transition duration-200 bg-blue-600 hover:bg-blue-800 shadow-md transform hover:scale-105`}
                                                href={`/cars/${likedCar.car.id}`}
                                            >
                                                View Car 
                                            </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-white text-center">No liked cars found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LikedCars;
