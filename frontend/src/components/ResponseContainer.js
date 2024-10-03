import React from 'react';
import axiosInstance from './axiosInstance';
import { useState,useEffect } from 'react';


const SellerResponsesList = ({ responses, setSelectedSeller }) => {
    return (
        <>
            <h2 className="text-2xl font-bold mb-4 text-white">Responses to Your Queries:</h2>
            {responses.length > 0 ? (
                <ul className="text-white">
                    {Array.from(new Set(responses.map(response => response.seller.user.username))).map(username => {
                        const sellerResponses = responses.filter(response => response.seller.user.username === username);
                        return (
                            <li
                                key={username}
                                className="border-b border-gray-700 py-2 cursor-pointer"
                                onClick={() => setSelectedSeller(username)}
                            >
                                <span className="font-bold">{username}</span>
                                <span className="ml-2">({sellerResponses.length} responses)</span>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className="text-white">No responses found.</p>
            )}
        </>
    );
};

const SelectedSellerResponses = ({ selectedSeller, responses, setSelectedSeller }) => {
    
    const [alertError, setalertError] = useState("");
    const [alertMessage, setAlertMessage] = useState("");

    useEffect(() => {
        let timer
        if (alertMessage || alertError) {
            timer = setTimeout(() => {
                setAlertMessage('');
                setalertError('');
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [alertMessage, alertError]);
    const handleResponse = async (queryId) => {
        try {
            const response = await axiosInstance.post(`http://localhost:8000/queries/response/${queryId}/`);
            console.log(response.data);
            setAlertMessage("Marked As Read")
        } catch (error) {
            console.error('Error:', error.response.data);
            setalertError("Failed To Mark As Read")
        }
    };

    return (
        <>
            {alertMessage && (
                <div className="bg-green-700 text-white p-4 fixed top-20 z-10 left-1/2 transform -translate-x-1/2 w-11/12 max-w-lg rounded-lg shadow-md flex items-center mb-4">
                    <span className="mr-2">✅</span>
                    <span>{alertMessage}</span>
                </div>
            )}

            {alertError && (
                <div className="bg-red-700 text-white p-4 fixed top-20 z-20 left-1/2 transform -translate-x-1/2 w-11/12 max-w-lg rounded-lg shadow-md flex items-center mb-4">
                    <span className="mr-2">❌</span>
                    <span>{alertError}</span>
                </div>
            )}
            <button onClick={() => setSelectedSeller(null)} className="mb-6 py-2 text-white rounded-md">
                <i className="fas fa-arrow-left"></i> &nbsp; Back
            </button>
            <h2 className="text-2xl font-bold mb-4 text-white">Responses from {selectedSeller}:</h2>
            <ul className="text-white">
                {responses.filter(response => response.seller.user.username === selectedSeller).map(response => (
                    <li key={response.id} className="border-b border-gray-700 py-4 flex justify-between items-center">
                        <div className="flex items-center mb-2">
                            <img
                                src={`http://localhost:8000/${response.seller.profile_pic}`}
                                alt={`${response.seller.user.username}'s profile`}
                                className="w-20 h-20 rounded-full mr-3"
                            />
                            <div className="flex-grow">
                                <span className="font-bold">Query:</span> {response.content} <br />
                                <span className="font-bold">Message:</span> {response.response_content}
                            </div>
                        </div>
                        <div className='flex gap-4'>
                            <a
                                href={`/cars/${response.car}/`}
                                className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500 transition duration-200"
                            >
                                View Car Details
                            </a>
                            <button
                                onClick={() => handleResponse(response.id)}
                                className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500 transition duration-200"
                            >
                                Mark As Read
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
};

const ResponsesContainer = ({ responses, selectedSeller, setSelectedSeller }) => {
    return (
        <div className="min-h-screen p-5">
            {selectedSeller == null ? (
                <SellerResponsesList responses={responses} setSelectedSeller={setSelectedSeller} />
            ) : (
                <SelectedSellerResponses
                    selectedSeller={selectedSeller}
                    responses={responses}
                    setSelectedSeller={setSelectedSeller}
                />
            )}
        </div>
    );
};

export default ResponsesContainer;
