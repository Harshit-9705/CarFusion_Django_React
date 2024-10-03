import React from 'react';
import { Link } from 'react-router-dom'; 
import NotFoundImage from '../images/NotFound.png';

const NotFound = () => {
    return (
        <div className="flex flex-col justify-center items-center min-h-screen text-white text-center" style={{ background: 'radial-gradient(circle, #2C2C2C 0%, #3A3A3A 40%, #333333 75% ,#222222 100%)' }}>
            <img src={NotFoundImage} alt="404 Not Found" className="mb-4 w-full max-w-md" />
            <h1 className="text-4xl font-bold mb-2">Page Not Found</h1>
            <p className="text-lg mb-4">Sorry, the page you are looking for does not exist.</p>
            <Link to="/" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">
                Go Back Home
            </Link>
        </div>
    );
};

export default NotFound;
