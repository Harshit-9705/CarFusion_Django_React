import React from 'react';

const LikedCarsTable = ({ likedCars, handleRemoveCar ,theme}) => {
    return (
        <div className="overflow-x-auto">
            <table className={`min-w-full bg-[#2a2a2a] border border-gray-700`}>
                <thead>
                    <tr>
                        <th className="py-3 px-4 border-b border-gray-600">Make</th>
                        <th className="py-3 px-4 border-b border-gray-600">Model</th>
                        <th className="py-3 px-4 border-b border-gray-600">Year</th>
                        <th className="py-3 px-4 border-b border-gray-600">Mileage</th>
                        <th className="py-3 px-4 border-b border-gray-600">Price</th>
                        <th className="py-3 px-4 border-b border-gray-600">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {likedCars.map(car => (
                        <tr key={car.carId} className="hover:bg-gray-700 transition duration-200 border-b border-gray-600">
                            <td className="py-3 px-4">{car.carMake}</td>
                            <td className="py-3 px-4">{car.carModel}</td>
                            <td className="py-3 px-4">{car.carYear}</td>
                            <td className="py-3 px-4">{car.mileage.toLocaleString()} km</td>
                            <td className="py-3 px-4">${car.carPrice.toLocaleString()}</td>
                            <td className="py-3 px-4">
                                <a href={`/cars/${car.carId}/`} className="text-blue-600 hover:underline">View Car</a>
                                <button onClick={() => handleRemoveCar(car.carId)} className="text-blue-600 hover:underline ml-4">Remove</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LikedCarsTable;
