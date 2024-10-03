import React from 'react';

const SoldCarsList = ({ unsoldCars, handleCarClick }) => {
    return (
        <>
            <h2 className="text-2xl font-bold mb-3 text-white">Cars Sold by You:</h2>
            {unsoldCars.length > 0 ? (
                <ul className="text-white">
                    {unsoldCars.map(car => (
                        <li
                            key={car.id}
                            className="border-b border-gray-700 py-2 cursor-pointer"
                            onClick={() => handleCarClick(car)}
                        >
                            <span className="font-bold">{car.name}</span> - {car.model} (ID: {car.id})
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-white">No cars found.</p>
            )}
        </>
    );
};

const CarReviews = ({ selectedCar, reviews, setSelectedCar }) => {
    return (
        <>
        <button onClick={() => setSelectedCar(null)} className="mb-6 py-2 text-white rounded-md">
                <i className="fas fa-arrow-left"></i> &nbsp; Back
            </button>
            <h2 className="text-2xl font-bold mb-3 text-white">User Reviews for Car - {selectedCar.make} {selectedCar.model}:</h2>
            {reviews.length > 0 ? (
                <table className="min-w-full bg-[#2a2a2a] text-white border border-gray-700">
                    <thead>
                        <tr>
                            <th className="py-3 px-4 border-b">User</th>
                            <th className="py-3 px-4 border-b">Rating</th>
                            <th className="py-3 px-4 border-b">Comment</th>
                            <th className="py-3 px-4 border-b">Date</th>
                            <th className="py-3 px-4 border-b">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.map(review => (
                            <tr key={review.id} className="border-b border-gray-700">
                                <td className="py-3 px-4">{review.user.username}</td>
                                <td className="py-3 px-4">{review.rating}</td>
                                <td className="py-3 px-4">{review.comment}</td>
                                <td className="py-3 px-4">{new Date(review.created_at).toLocaleDateString()}</td>
                                <td className="py-3 px-4">
                                    <a href={`cars/${selectedCar.id}`} className='decoration-none text-white'>
                                        view car
                                    </a>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-white">No reviews found.</p>
            )}
        </>
    );
};

const ReviewContainer = ({ selectedCar, unsoldCars, handleCarClick, reviews, setSelectedCar }) => {
    return (
        <div className="min-h-screen p-5">
            {selectedCar === null ? (
                <SoldCarsList unsoldCars={unsoldCars} handleCarClick={handleCarClick} />
            ) : (
                <CarReviews selectedCar={selectedCar} setSelectedCar={setSelectedCar} reviews={reviews} />
            )}
        </div>
    );
};

export default ReviewContainer;
