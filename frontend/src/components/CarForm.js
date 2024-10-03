import React, { useState,useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { FaCar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CarRegistration = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [errorMessage, setErrorMessage] = useState('');
    const [image, setImage] = useState(null);
    const [alertError, setalertError] = useState("");
    const [alertMessage, setAlertMessage] = useState("");

    const navigate = useNavigate()
    useEffect(()=>{
        if(!localStorage.getItem("token")){
            navigate("/login")
        }
    })

    useEffect(() => {
        let timer
        if (alertMessage || alertError) {
            timer = setTimeout(() => {
                setAlertMessage('');
                setalertError('');
            }, 3000);
    
            return () => clearTimeout(timer);
        }
    }, [alertMessage, alertError]);

    const onSubmit = async (data) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => formData.append(key, data[key]));
        if (image) {
            formData.append('image', image);
        }

        try {
            await axios.post('http://127.0.0.1:8000/cars/', formData, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setAlertMessage("Car Added SuccessFully")
        } catch (error) {
            const errorMessages = error.response
                ? Object.entries(error.response.data)
                    .filter(([field]) => field !== "error") 
                    .map(([field, messages]) => messages.join(', ')) 
                    .join('\n')
                : 'Network error. Please try again later.';

            setErrorMessage(errorMessages);
            if (error.response?.data?.error) {
                setalertError(error.response.data.error);
            }
        }

    }




return (
    <div className="flex items-start justify-center min-h-screen p-4 bg-[#2C2C2C]">
        {alertMessage && (
            <div className="bg-green-700 text-white p-4 fixed top-20 z-10 left-1/2 transform -translate-x-1/2 w-11/12 max-w-lg rounded-lg shadow-md flex items-center mb-4">
                <span className="mr-2">✅</span>
                <span>{alertMessage}</span>
            </div>
        )}

        {alertError && (
            <div className="bg-red-700 text-white p-4 fixed top-20 z-20 left-1/2 transform -translate-x-1/2 w-11/12 max-w-lg rounded-lg shadow-md flex items-center mb-4">
                <span className="mr-2">❌</span>
                <span>{alertError}</span>
            </div>
        )}
        <div className="w-full max-w-3xl p-4 bg-[#1A1A1A] shadow-lg mb-4 rounded-lg">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-300">Register Your Car</h2>
            {errorMessage && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{errorMessage}</div>}
            <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['make', 'model', 'year', 'price', 'description', 'color', 'transmission', 'mileage', 'condition', 'number_of_doors', 'location', 'fuel_type'].map((field) => (
                    <div className="flex flex-col mb-4" key={field}>
                        <label htmlFor={field} className="block text-sm font-medium text-gray-300 capitalize">{field}</label>
                        {field === 'description' ? (
                            <textarea
                                id={field}
                                {...register(field, { required: `${field.charAt(0).toUpperCase() + field.slice(1)} is required` })}
                                className=" block w-full px-4 py-2 bg-[#2C2C2C] border border-gray-500 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        ) : field === 'transmission' || field === 'condition' || field === 'fuel_type' ? (
                            <select
                                id={field}
                                {...register(field, { required: `${field.charAt(0).toUpperCase() + field.slice(1)} is required` })}
                                className=" block w-full px-4 py-2 bg-[#2C2C2C] border border-gray-500 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select {field.charAt(0).toUpperCase() + field.slice(1)}</option>
                                {field === 'transmission' && ['Automatic', 'Manual', 'CVT', 'Semi-Automatic'].map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                                {field === 'condition' && ['New', 'Used', 'Certified Pre-Owned'].map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                                {field === 'fuel_type' && ['Petrol', 'Diesel', 'Electric', 'Hybrid'].map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        ) : (
                            <input
                                id={field}
                                type={field === 'year' || field === 'price' || field === 'mileage' || field === 'number_of_doors' ? 'number' : 'text'}
                                {...register(field, {
                                    required: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`,
                                    ...(field === 'year' && { min: { value: 1886, message: 'Year must be 1886 or later' }, max: { value: new Date().getFullYear(), message: 'Year cannot be in the future' } }),
                                    ...(field === 'price' && { min: { value: 0, message: 'Price must be a positive number' } }),
                                    ...(field === 'mileage' && { min: { value: 0, message: 'Mileage must be a positive number' } ,max: { value: 99, message: 'Price must be a positive number' }}),
                                    ...(field === 'number_of_doors' && { min: { value: 1, message: 'At least 1 door' } })
                                })}
                                className=" block w-full px-4 py-2 bg-[#2C2C2C] border border-gray-500 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        )}
                        {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field].message}</p>}
                    </div>
                ))}
                <div className="mb-4">
                    <label htmlFor="image" className="block text-sm font-medium text-gray-300">Image</label>
                    <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                        className=" block w-full px-4 py-2 bg-[#2C2C2C] border border-gray-500 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="col-span-1 md:col-span-2">
                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 flex items-center justify-center"
                    >
                        <FaCar className="mr-2" /> Register Car
                    </button>
                </div>
            </form>
        </div>
    </div>
);
};

export default CarRegistration;
