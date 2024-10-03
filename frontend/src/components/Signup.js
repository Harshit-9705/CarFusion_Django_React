import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus } from 'react-icons/fa';


const Signup = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [image, setImage] = useState(null);

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('username', data.username);
        formData.append('password', data.password);
        formData.append('gender', data.gender);
        formData.append('address', data.address);
        formData.append('email', data.email);
        formData.append('city', data.city);
        formData.append('phone_num', data.phone_num);
        formData.append('user_type', data.user_type);
        if (image) {
            formData.append('profile_pic', image);
        }


        try {
            const response = await axios.post('http://127.0.0.1:8000/signup/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            localStorage.setItem('token', response.data.token);
            navigate('/');
        } catch (error) {
            if (error.response) {
                const errorMessages = Object.entries(error.response.data).map(([field, messages]) => {
                    // Ensure messages is an array
                    const errorMsg = Array.isArray(messages) ? messages.join(', ') : messages;
                    return `${field}: ${errorMsg}`;
                }).join('\n');
                setErrorMessage(errorMessages || 'Signup failed. Please check your input.');
            } else {
                setErrorMessage('Network error. Please try again later.');
            }
        }
    

};

return (
    <div className="flex items-center justify-center bg-[#2C2C2C]" style={{ height: 'calc(100vh - 80px)' }}>
        <div className="w-full max-w-3xl p-8  shadow-lg bg-[#1A1A1A] rounded-lg">
            <h2 className="text-3xl font-bold mb-6 text-center text-white">Create Account</h2>
            {errorMessage && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{errorMessage}</div>}
            <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="flex flex-col">
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium text-white">Username</label>
                        <input
                            id="username"
                            type="text"
                            {...register('username', { required: 'Username is required' })}
                            className="mt-1 block w-full px-4 py-2 text-white bg-[#1A1A1A] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-white">Email</label>
                        <input
                            id="email"
                            type="email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: 'Email format is invalid'
                                }
                            })}
                            className="mt-1 block w-full px-4 py-2 text-white bg-[#1A1A1A] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-white">Password</label>
                        <input
                            id="password"
                            type="password"
                            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                            className="mt-1 block w-full px-4 py-2 bg-[#1A1A1A] text-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="gender" className="block text-sm font-medium text-white">Gender</label>
                        <select
                            id="gender"
                            {...register('gender', { required: 'User type is required' })}
                            className="mt-1 block w-full px-4 py-2 bg-[#1A1A1A] text-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                        {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob.message}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="address" className="block text-sm font-medium text-white">Address</label>
                        <textarea
                            id="address"
                            {...register('address')}
                            className="mt-1 block w-full px-4 py-2 bg-[#1A1A1A] text-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Right Column */}
                <div className="flex flex-col">
                    <div className="mb-4">
                        <label htmlFor="city" className="block text-sm font-medium text-white">City</label>
                        <input
                            id="city"
                            type="text"
                            {...register('city', { required: 'City is required' })}
                            className="mt-1 block w-full px-4 py-2 bg-[#1A1A1A] text-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="phone_num" className="block text-sm font-medium text-white">Phone Number</label>
                        <input
                            id="phone_num"
                            type="text"
                            {...register('phone_num', {
                                required: 'Phone number is required',
                                minLength: { value: 10, message: 'Phone number must be at least 10 digits' },
                                maxLength: { value: 10, message: 'Phone number must be at most 10 digits' }
                            })}
                            className="mt-1 block w-full px-4 py-2 bg-[#1A1A1A] text-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.phone_num && <p className="text-red-500 text-xs mt-1">{errors.phone_num.message}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="user_type" className="block text-sm font-medium text-white">User Type</label>
                        <select
                            id="user_type"
                            {...register('user_type', { required: 'User type is required' })}
                            className="mt-1 block w-full px-4 py-2 bg-[#1A1A1A] text-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select User Type</option>
                            <option value="buyer">Buyer</option>
                            <option value="seller">Seller</option>
                        </select>
                        {errors.user_type && <p className="text-red-500 text-xs mt-1">{errors.user_type.message}</p>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="profile_pic" className="block text-sm font-medium text-white">Profile Picture</label>
                        <input
                            id="profile_pic"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                            className="mt-1 block w-full px-4 py-2 bg-[#1A1A1A] text-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="col-span-2">
                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 flex items-center justify-center"
                    >
                        <FaUserPlus className="mr-2" /> Sign Up
                    </button>
                </div>
            </form>
        </div>
    </div>
);
};

export default Signup;
