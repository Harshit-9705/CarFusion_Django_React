import React from 'react';

const UpdateProfileForm = ({ handleSubmit, handleImageChange, formData, handleChange }) => {
    return (
        <form onSubmit={handleSubmit} className="mt-5 p-5 rounded-lg">
            <h2 className="text-2xl font-bold text-white">Update Profile</h2>
            <div>
                <label className="block text-sm font-medium text-gray-300">Upload Profile Picture</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-1 block w-full p-3 bg-[#1a1a1a] border border-gray-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 mb-4"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300">Address</label>
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-1 block w-full p-3 bg-[#1a1a1a] border border-gray-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 mb-4"
                />
                <label className="block text-sm font-medium text-gray-300">City</label>
                <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="mt-1 block w-full p-3 bg-[#1a1a1a] border border-gray-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 mb-4"
                />
                <button
                    type="submit"
                    className="w-full mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 focus:outline-none transition duration-300"
                >
                    Update Details
                </button>
            </div>
        </form>
    );
};

export default UpdateProfileForm;
