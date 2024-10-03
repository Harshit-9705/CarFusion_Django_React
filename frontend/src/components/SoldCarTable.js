import React from 'react';

const SoldCarsTable = ({ carsSold }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-[#2a2a2a] text-white border border-gray-700">
                <thead>
                    <tr>
                        <th className="py-3 px-4 border-b border-gray-600">Make</th>
                        <th className="py-3 px-4 border-b border-gray-600">Model</th>
                        <th className="py-3 px-4 border-b border-gray-600">Year</th>
                        <th className="py-3 px-4 border-b border-gray-600">Mileage</th>
                        <th className="py-3 px-4 border-b border-gray-600">Condition</th>
                        <th className="py-3 px-4 border-b border-gray-600">Fuel Type</th>
                        <th className="py-3 px-4 border-b border-gray-600">Price</th>
                        <th className="py-3 px-4 border-b border-gray-600">Sold Date/Time</th>
                    </tr>
                </thead>
                <tbody>
                    {carsSold.map(car => (
                        <tr key={car.id} className="hover:bg-gray-700 transition duration-200 border-b border-gray-600">
                            <td className="py-3 px-4">{car.car.make}</td>
                            <td className="py-3 px-4">{car.car.model}</td>
                            <td className="py-3 px-4">{car.car.year}</td>
                            <td className="py-3 px-4">{car.car.mileage.toLocaleString()} km</td>
                            <td className="py-3 px-4">{car.car.condition}</td>
                            <td className="py-3 px-4">{car.car.fuel_type}</td>
                            <td className="py-3 px-4">${car.car.price.toLocaleString()}</td>
                            <td className="py-3 px-4">{new Date(car.date).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SoldCarsTable;
