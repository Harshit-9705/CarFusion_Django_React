import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSignInAlt } from 'react-icons/fa';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [alert, setAlert] = useState('');
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/login/', data);
            console.log(response.data);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.username));
            navigate('/');
        } catch (error) {
            console.error('Login failed', error);
            setAlert('Invalid username or password'); 
        }
    };

    return (
        <div className="flex flex-col" style={{ height: 'calc(100vh - 80px)', backgroundColor: '#2C2C2C' }}>
            <div className="flex-1 flex items-center justify-center">
                <div className="w-full max-w-md p-8 bg-[#1A1A1A] shadow-lg rounded-lg">
                    <h2 className="text-3xl font-bold mb-6 text-center text-white">Welcome Back</h2>

                    {/* Alert for invalid credentials */}
                    {alert && (
                        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                            {alert}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-sm font-medium text-white">Username</label>
                            <input
                                id="username"
                                type="text"
                                {...register('username', { required: 'Username is required' })}
                                className="mt-1 block w-full px-4 py-2 bg-[#1A1A1A] text-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                        </div>

                        <div className="mb-6">
                            <label htmlFor="password" className="block text-sm font-medium text-white">Password</label>
                            <input
                                id="password"
                                type="password"
                                {...register('password', { required: 'Password is required' })}
                                className="mt-1 block w-full px-4 py-2 bg-[#1A1A1A] text-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 flex items-center justify-center"
                        >
                            <FaSignInAlt className="mr-2" /> Login
                        </button>

                        <div className="mt-4 text-center">
                            <p className="text-sm text-white">Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign Up</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
