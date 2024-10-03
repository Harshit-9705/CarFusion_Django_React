import React from 'react';

const BoughtCarsTable = ({ boughtCars = [] }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-[#2a2a2a] text-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b border-gray-700">Car Make</th>
                        <th className="py-2 px-4 border-b border-gray-700">Car Model</th>
                        <th className="py-2 px-4 border-b border-gray-700">Seller</th>
                        <th className="py-2 px-4 border-b border-gray-700">Mileage</th>
                        <th className="py-2 px-4 border-b border-gray-700">Year</th>
                        <th className="py-2 px-4 border-b border-gray-700">Condition</th>
                        <th className="py-2 px-4 border-b border-gray-700">Color</th>
                        <th className="py-2 px-4 border-b border-gray-700">Transmission</th>
                        <th className="py-2 px-4 border-b border-gray-700">Fuel Type</th>
                        <th className="py-2 px-4 border-b border-gray-700">Bought Date/Time</th>
                    </tr>
                </thead>
                <tbody>
                    {boughtCars.length > 0 ? (
                        boughtCars.map(car => (
                            <tr key={car.id} className="hover:bg-gray-700">
                                <td className="py-2 px-4 border-b border-gray-700">{car.car.make}</td>
                                <td className="py-2 px-4 border-b border-gray-700">{car.car.model}</td>
                                <td className="py-2 px-4 border-b border-gray-700">{car.car.seller?.user?.username || 'N/A'}</td>
                                <td className="py-2 px-4 border-b border-gray-700">{car.car.mileage} km</td>
                                <td className="py-2 px-4 border-b border-gray-700">{car.car.year}</td>
                                <td className="py-2 px-4 border-b border-gray-700">{car.car.condition}</td>
                                <td className="py-2 px-4 border-b border-gray-700">{car.car.color}</td>
                                <td className="py-2 px-4 border-b border-gray-700">{car.car.transmission}</td>
                                <td className="py-2 px-4 border-b border-gray-700">{car.car.fuel_type}</td>
                                <td className="py-2 px-4 border-b border-gray-700">    {new Date(car.date).toLocaleString('en-US')}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="9" className="py-2 px-4 text-center border-b border-gray-700">
                                No cars bought yet.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default BoughtCarsTable;
