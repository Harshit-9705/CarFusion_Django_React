import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';

const CarUpdatePage = () => {
    const { id } = useParams();
    const [carDetails, setCarDetails] = useState({
        year: '',
        price: '',
        description: '',
        color: '',
        transmission: '',
        mileage: '',
        condition: '',
        number_of_doors: '',
        location: '',
        fuel_type: '',
    });
    const [error, setError] = useState('');
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [loading, setLoading] = useState(true);
    const [carImage, setCarImage] = useState(null);
    const [updateCarImage, setUpdateCarImage] = useState(null);
    const navigate = useNavigate()
    useEffect(()=>{
        if(!localStorage.getItem("token")){
            navigate("/login")
        }
    })

    useEffect(() => {
        const fetchCarDetails = async () => {
            try {
                const response = await axiosInstance.get(`/cars/${id}/`);
                const { seller, image, make, model, ...carData } = response.data;
                setCarDetails(carData);
                setMake(make);
                setModel(model);
                setCarImage(image);
            } catch (error) {
                setError('Failed to fetch car details');
            } finally {
                setLoading(false);
            }
        };

        fetchCarDetails();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCarDetails((prevState) => ({
            ...prevState,
            [name]: name === 'price' || name === 'mileage' || name === 'year' || name === 'number_of_doors'
                ? Number(value)
                : value,
        }));
    };

    const handleImageChange = (e) => {
        setUpdateCarImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        for (const key in carDetails) {
            if (key !== 'make' && key !== 'model' && key !== 'id') {
                formData.append(key, carDetails[key]);
            }
        }
        if (updateCarImage) {
            formData.append('image', updateCarImage);
        }

        try {
            await axiosInstance.put(`/cars/${id}/`, formData, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Car details updated successfully!');
            navigate("/profile");
        } catch (error) {
            console.log(error);
            setError('Failed to update car details');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="container-fluid mx-auto py-7 bg-[#2C2C2C] ">
            <h1 className="text-4xl font-bold mb-8 text-center text-white">Update Car Details</h1>
            {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

            <div className="flex flex-col lg:flex-row gap-2 px-10 mb-14">
                {/* Car Image Section */}
                <div className="flex-shrink-0 lg:w-1/2">
                    {carImage ? (
                        <img
                            src={`http://localhost:8000/${carImage}`}
                            alt="Car"
                            className="w-full h-full rounded-lg"
                        />
                    ) : (
                        <div className="h-64 bg-gray-300 flex items-center justify-center rounded-lg shadow-md">
                            <span className="text-white">No Image Available</span>
                        </div>
                    )}
                </div>


                {/* Form Section */}
                <form onSubmit={handleSubmit} className="px-4 flex-1 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Make</label>
                            <input
                                type="text"
                                name="make"
                                value={make}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 p-2 bg-[#1A1A1A] text-white"
                                readOnly
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300">Model</label>
                            <input
                                type="text"
                                name="model"
                                value={model}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 p-2 bg-[#1A1A1A] text-white"
                                readOnly
                            />
                        </div>

                        {/* Other form fields */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Year</label>
                            <input
                                type="number"
                                name="year"
                                value={carDetails.year}
                                onChange={handleChange}
                                min={1000}    // Minimum 4-digit number
                                max={new Date().getFullYear()}    // Maximum 4-digit number
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 p-2 bg-[#1A1A1A] text-white"
                            />
                        </div>


                        <div>
                            <label className="block text-sm font-medium text-gray-300">Price</label>
                            <input
                                type="number"
                                name="price"
                                value={carDetails.price}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 p-2 bg-[#1A1A1A] text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300">Color</label>
                            <input
                                type="text"
                                name="color"
                                value={carDetails.color}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 p-2 bg-[#1A1A1A] text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300">Transmission</label>
                            <select
                                name="transmission"
                                value={carDetails.transmission}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 p-2 bg-[#1A1A1A] text-white"
                            >
                                <option value="">Select Transmission</option>
                                <option value="Automatic">Automatic</option>
                                <option value="Manual">Manual</option>
                                <option value="CVT">CVT</option>
                                <option value="Semi-Automatic">Semi-Automatic</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300">Mileage (km)</label>
                            <input
                                type="number"
                                name="mileage"
                                value={carDetails.mileage}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 p-2 bg-[#1A1A1A] text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300">Condition</label>
                            <select
                                name="condition"
                                value={carDetails.condition}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 p-2 bg-[#1A1A1A] text-white"
                            >
                                <option value="">Select Condition</option>
                                <option value="New">New</option>
                                <option value="Used">Used</option>
                                <option value="Certified Pre-Owned">Certified Pre-Owned</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300">Number of Doors</label>
                            <input
                                type="number"
                                name="number_of_doors"
                                value={carDetails.number_of_doors}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 p-2 bg-[#1A1A1A] text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={carDetails.location}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 p-2 bg-[#1A1A1A] text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300">Fuel Type</label>
                            <select
                                name="fuel_type"
                                value={carDetails.fuel_type}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 p-2 bg-[#1A1A1A] text-white"
                            >
                                <option value="">Select Fuel Type</option>
                                <option value="Petrol">Petrol</option>
                                <option value="Diesel">Diesel</option>
                                <option value="Electric">Electric</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300">Description</label>
                            <textarea
                                name="description"
                                value={carDetails.description}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 p-2 bg-[#1A1A1A] text-white"
                                rows="3"
                            />
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300">Car Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 p-2 bg-[#1A1A1A] text-white"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="mt-6 w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 focus:outline-none transition duration-300"
                    >
                        Update Car Details
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CarUpdatePage;
