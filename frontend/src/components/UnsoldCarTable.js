import React from 'react';
import AddCarImages from './AddCarImage';


const UnsoldCarsTable = ({ unsoldCars, handleDeleteCar, toggleImageUploader, showImageUploader }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-[#2a2a2a] text-white border border-gray-700">
                <thead>
                    <tr>
                        <th className="py-3 px-4 border-b">Make</th>
                        <th className="py-3 px-4 border-b">Model</th>
                        <th className="py-3 px-4 border-b">Year</th>
                        <th className="py-3 px-4 border-b">Mileage</th>
                        <th className="py-3 px-4 border-b">Condition</th>
                        <th className="py-3 px-4 border-b">Fuel Type</th>
                        <th className="py-3 px-4 border-b">Price</th>
                        <th className="py-3 px-4 border-b">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {unsoldCars.map(car => (
                        <tr key={car.id} className="hover:bg-gray-700 transition duration-200 border-b border-gray-600">
                            <td className="py-3 px-4">{car.make}</td>
                            <td className="py-3 px-4">{car.model}</td>
                            <td className="py-3 px-4">{car.year}</td>
                            <td className="py-3 px-4">{car.mileage.toLocaleString()} km</td>
                            <td className="py-3 px-4">{car.condition}</td>
                            <td className="py-3 px-4">{car.fuel_type}</td>
                            <td className="py-3 px-4">${car.price.toLocaleString()}</td>
                            <td className="py-3 px-4">
                                <a href={`/car/${car.id}/`} className="text-blue-500 hover:text-blue-700">Update</a>
                                <button
                                    onClick={() => handleDeleteCar(car.id)}
                                    className="ml-2 text-red-500 hover:text-red-700 transition duration-200"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => toggleImageUploader(car.id)}
                                    className="text-green-500 hover:text-green-700"
                                >
                                    {showImageUploader === car.id ? 'Hide Upload' : 'Add Images'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showImageUploader && <AddCarImages carId={showImageUploader} />}
        </div>
    );
};

export default UnsoldCarsTable;
