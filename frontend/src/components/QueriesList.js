import React from 'react';

const QueriesList = ({ queries, setSelectedBuyer }) => {
    return (
        <>
            <h2 className="text-2xl font-bold mb-3 text-white">Incoming Queries:</h2>
            {queries.length > 0 ? (
                <ul className="text-white">
                    {Array.from(new Set(queries.map(query => query.buyer.user.username))).map(buyerName => {
                        const buyerQueries = queries.filter(query => query.buyer.user.username === buyerName);
                        return (
                            <li
                                key={buyerName}
                                className="border-b border-gray-700 py-2 cursor-pointer"
                                onClick={() => setSelectedBuyer(buyerQueries)}
                            >
                                <span className="font-bold">{buyerName}</span>:
                                <span className="ml-2">{buyerQueries.length} queries</span>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className="text-white">No queries found.</p>
            )}
        </>
    );
};

const BuyerQueries = ({ selectedBuyer, setSelectedBuyer, response, handleResponseChange, handleQuerySubmit }) => {
    return (
        <>
            <button onClick={() => setSelectedBuyer(null)} className="mb-6 py-2 text-white rounded-md">
                <i className="fas fa-arrow-left"></i> &nbsp; Back
            </button>
            <h2 className="text-2xl font-bold mb-3 text-white">Queries from {selectedBuyer[0].buyer.user.username}:</h2>
            <ul className="text-white">
                {selectedBuyer.map(query => (
                    <li key={query.id} className="border-b border-gray-700 py-4 flex flex-col">
                        <div className="flex justify-between">
                            <div className="flex items-center mb-2">
                                <img
                                    src={`http://localhost:8000/${query.buyer.profile_pic}`}
                                    alt={`${query.buyer.user.username}'s profile`}
                                    className="w-20 h-20 rounded-full mr-3"
                                />
                                <div>
                                    <span className="font-bold">User Type:</span> {query.buyer.user_type} <br />
                                    <span className="font-bold">Message:</span> {query.content}
                                </div>
                            </div>
                            <div>
                                <a
                                    href={`/cars/${query.car}/`}
                                    className="inline-block mt-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500 transition duration-200"
                                >
                                    View Car Details
                                </a>
                            </div>
                        </div>
                        <div className="mt-4">
                            <textarea
                                placeholder="Type your response..."
                                value={response[query.id] || ''}
                                onChange={(e) => handleResponseChange(query.id, e.target.value)}
                                className="w-full p-2 border border-gray-600 rounded-md bg-[#222222] text-white"
                            />
                            <button
                                onClick={() => handleQuerySubmit(query.id)}
                                className="mt-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500 transition duration-200"
                            >
                                Respond
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
};

const QueriesContainer = ({ queries, selectedBuyer, setSelectedBuyer, response, handleResponseChange, handleQuerySubmit }) => {
    return (
        <div className="min-h-screen p-5">
            {selectedBuyer == null ? (
                <QueriesList queries={queries} setSelectedBuyer={setSelectedBuyer} />
            ) : (
                <BuyerQueries 
                    selectedBuyer={selectedBuyer} 
                    setSelectedBuyer={setSelectedBuyer} 
                    response={response} 
                    handleResponseChange={handleResponseChange} 
                    handleQuerySubmit={handleQuerySubmit} 
                />
            )}
        </div>
    );
};

export default QueriesContainer;
