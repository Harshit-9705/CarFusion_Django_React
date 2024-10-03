import React, { useEffect, useState } from 'react';
import { FaMapMarkerAlt, FaHeart, FaGasPump, FaUser, FaTachometerAlt } from 'react-icons/fa';
import axiosInstance from './axiosInstance';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CarListingPage = () => {
    const [cars, setCars] = useState([]);
    const [filters, setFilters] = useState({
        transmission: '',
        condition: '',
        priceRange: [0, Infinity], // Allow all prices by default
        mileage: '',
        fuelType: '',
        city: '',
        make: '',
        model: '',
    });
    const [showFilters, setShowFilters] = useState(false);
    const [alertError, setAlertError] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const navigate = useNavigate()

    useEffect(()=>{
        if(!localStorage.getItem("token")){
            navigate("/login")
        }
    })

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await axios.get('http://localhost:8000/cars/', {
                    headers: {
                        Authorization: `Token ${localStorage.getItem('token')}`
                    }
                });
                setCars(response.data);
            } catch (error) {
                console.error('Error fetching cars:', error);
            }
        };

        fetchCars();
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

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

    const filteredCars = cars.filter((car) => {
        return (
            (filters.transmission ? car.transmission === filters.transmission : true) &&
            (filters.condition ? car.condition === filters.condition : true) &&
            (car.price >= filters.priceRange[0] && car.price <= filters.priceRange[1]) &&
            (filters.mileage ? car.mileage <= filters.mileage : true) &&
            (filters.fuelType ? car.fuel_type === filters.fuelType : true) &&
            (filters.city ? car.location.toLowerCase().includes(filters.city.toLowerCase()) : true) &&
            (filters.make ? car.make.toLowerCase() === filters.make.toLowerCase() : true) &&
            (filters.model ? car.model.toLowerCase() === filters.model.toLowerCase() : true)
        );
    });

    const handleLikeCar = async (id) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setAlertError("Please Login First");
            return;
        }
        try {
            await axiosInstance.post(`/liked-cars/`, { "car": id });
            setAlertMessage("Liked Successfully");
        } catch (error) {
            setAlertError(error.response.data.detail);
        }
    };

    return (
        <div
            className="flex flex-col lg:flex-row"
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

            <div className="p-4 block lg:hidden">
                <button
                    onClick={() => setShowFilters((prev) => !prev)}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                >
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
            </div>

            <div className={`w-full lg:w-1/4 p-4 lg:sticky lg:top-14 lg:h-screen overflow-y-auto bg-[#2A2A2A] ${showFilters ? '' : 'hidden lg:block'}`}>
                <h2 className="text-lg font-bold mb-4 text-white">Filters</h2>
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block mb-2 text-white">Transmission</label>
                        <select name="transmission" onChange={handleFilterChange} className="w-full bg-[#2A2A2A] text-white p-2 border border-gray-600 rounded">
                            <option value="">All</option>
                            <option value="Automatic">Automatic</option>
                            <option value="Manual">Manual</option>
                            <option value="CVT">CVT</option>
                            <option value="Semi-Automatic">Semi-Automatic</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-2 text-white">Condition</label>
                        <select name="condition" onChange={handleFilterChange} className="w-full bg-[#2A2A2A] p-2 border border-gray-600 text-white rounded">
                            <option value="">All</option>
                            <option value="New">New</option>
                            <option value="Used">Used</option>
                            <option value="Certified Pre-Owned">Certified Pre-Owned</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-2 text-white">Price Range</label>
                        <div className="flex lg:flex-col flex-row gap-3">
                            <input
                                type="number"
                                name="minPrice"
                                placeholder="Min Price"
                                onChange={(e) => setFilters((prev) => ({ ...prev, priceRange: [Number(e.target.value), prev.priceRange[1]] }))}
                                className="w-full p-2 bg-[#2A2A2A] border border-gray-600 text-white rounded"
                            />
                            <input
                                type="number"
                                name="maxPrice"
                                placeholder="Max Price"
                                onChange={(e) => setFilters((prev) => ({ ...prev, priceRange: [prev.priceRange[0], Number(e.target.value)] }))}
                                className="w-full p-2 bg-[#2A2A2A] border border-gray-600 text-white rounded"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block mb-2 text-white">Mileage (km)</label>
                        <input
                            type="number"
                            name="mileage"
                            placeholder="Max Mileage"
                            onChange={handleFilterChange}
                            className="w-full p-2 bg-[#2A2A2A] border border-gray-600 text-white rounded"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-white">Fuel Type</label>
                        <select name="fuelType" onChange={handleFilterChange} className="w-full bg-[#2A2A2A] text-white p-2 border border-gray-600 rounded">
                            <option value="">All</option>
                            <option value="Petrol">Petrol</option>
                            <option value="Diesel">Diesel</option>
                            <option value="Electric">Electric</option>
                            <option value="Hybrid">Hybrid</option>
                        </select>
                    </div>
                    <div>
                        <label className="block mb-2 text-white">City</label>
                        <input
                            type="text"
                            name="city"
                            placeholder="City"
                            onChange={handleFilterChange}
                            className="w-full p-2 bg-[#2A2A2A] border border-gray-600 text-white rounded"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-white">Make</label>
                        <input
                            type="text"
                            name="make"
                            placeholder="Make"
                            onChange={handleFilterChange}
                            className="w-full p-2 bg-[#2A2A2A] border border-gray-600 text-white rounded"
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-white">Model</label>
                        <input
                            type="text"
                            name="model"
                            placeholder="Model"
                            onChange={handleFilterChange}
                            className="w-full p-2 bg-[#2A2A2A] border border-gray-600 text-white rounded"
                        />
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-3/4 p-4">
                <h2 className="text-lg font-bold mb-4 text-white">Available Cars</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredCars.map((suggestedCar) => (
                        <div key={suggestedCar.id} className="w-full flex flex-col">
                            <div className="featured-car-card bg-[#2A2A2A] hover:bg-transparent hover:shadow-none rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-95 duration-200 flex flex-col">
                                <figure className="relative card-banner">
                                    <img
                                        src={`http://127.0.0.1:8000${suggestedCar.image}`}
                                        alt={`${suggestedCar.make} ${suggestedCar.model}`}
                                        className="w-full h-64 rounded-lg object-cover"
                                    />
                                    <button
                                        className="absolute top-2 right-2 p-2 rounded text-white bg-red-600 hover:bg-red-800 shadow-md transform hover:scale-105 transition duration-200"
                                        onClick={() => handleLikeCar(suggestedCar.id)}
                                    >
                                        <FaHeart />
                                    </button>
                                </figure>

                                <div className="card-content p-4 flex-grow">
                                    <div className="card-title-wrapper flex justify-between items-center mb-2">
                                        <h3 className="h3 card-title flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                                            <a href={`/cars/${suggestedCar.id}`} className="text-lg font-semibold text-gray-300 hover:text-gray-400 transition duration-200">
                                                {`${suggestedCar.make} ${suggestedCar.model}`}
                                            </a>
                                        </h3>
                                        <data className="year text-gray-500" value={suggestedCar.year}>{suggestedCar.year}</data>
                                    </div>

                                    <ul className="card-list list-none mb-4">
                                        <li className="card-list-item flex items-center mb-1">
                                            <FaUser className="mr-2 text-blue-500" />
                                            <span className="card-item-text text-gray-300">{`${suggestedCar.seller.user.username}`}</span>
                                        </li>
                                        <li className="card-list-item flex items-center mb-1">
                                            <FaMapMarkerAlt className="mr-2 text-blue-500" />
                                            <span className="card-item-text text-gray-300">{`${suggestedCar.location}`}</span>
                                        </li>
                                        <li className="card-list-item flex items-center mb-1">
                                            <FaGasPump className="mr-2 text-blue-500" />
                                            <span className="card-item-text text-gray-300">{suggestedCar.fuel_type}</span>
                                        </li>
                                        <li className="card-list-item flex items-center mb-1">
                                            <FaTachometerAlt className="mr-2 text-blue-500" />
                                            <span className="card-item-text text-gray-300">{`${suggestedCar.mileage} km`}</span>
                                        </li>
                                    </ul>

                                    <div className="card-price-wrapper flex items-center gap-2 justify-between mt-4">
                                        <p className="card-price text-lg font-bold text-blue-500">
                                            <strong>₹{suggestedCar.price.toLocaleString()}</strong>
                                        </p>

                                        <a href={`/cars/${suggestedCar.id}`} className="btn bg-blue-500 text-ellipsis whitespace-nowrap text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">
                                            View Now
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CarListingPage;
