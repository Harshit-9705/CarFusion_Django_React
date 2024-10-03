// AddCarImages.js
import React, { useState } from 'react';
import axiosInstance from './axiosInstance';


const AddCarImages = ({ carId }) => {
    const [images, setImages] = useState([]);

    const handleImageChange = (event) => {
        const selectedImages = Array.from(event.target.files);
        setImages(selectedImages);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        images.forEach((image) => {
            formData.append('images', image);  
        });
    
        try {
            const response = await axiosInstance.post(`/cars/${carId}/images/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            if (response.status === 201) {
                alert('Images uploaded successfully!');
                setImages([]);
            } else {
                alert('Failed to upload images.');
            }
        } catch (error) {
            console.error('Error uploading images:', error);
            alert('An error occurred while uploading images.');
        }
    };
    

    return (
        <div className="mt-4">
            <input
                type="file"
                multiple
                onChange={handleImageChange}
                className="text-white"
            />
            <button
                onClick={handleUpload}
                className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Upload Images
            </button>
        </div>
    );
};

export default AddCarImages;
