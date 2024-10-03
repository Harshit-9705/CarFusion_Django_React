import React from 'react';

const TransactionTable = ({ transactions }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-[#2a2a2a] text-white">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b border-gray-700">Car</th>
                        <th className="py-2 px-4 border-b border-gray-700">Buyer</th>
                        <th className="py-2 px-4 border-b border-gray-700">Seller</th>
                        <th className="py-2 px-4 border-b border-gray-700">Date</th>
                        <th className="py-2 px-4 border-b border-gray-700">Price</th>
                        <th className="py-2 px-4 border-b border-gray-700">Payment Status</th>
                        <th className="py-2 px-4 border-b border-gray-700">Transaction Reference</th>
                        <th className="py-2 px-4 border-b border-gray-700">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.length > 0 ? (
                        transactions.map(transaction => (
                            <tr key={transaction.id} className="hover:bg-gray-700">
                                <td className="py-2 px-4 border-b border-gray-700">{transaction.car.model}</td>
                                <td className="py-2 px-4 border-b border-gray-700">{transaction.buyer.user.username}</td>
                                <td className="py-2 px-4 border-b border-gray-700">{transaction.car.seller.user.username}</td>
                                <td className="py-2 px-4 border-b border-gray-700">{new Date(transaction.date).toLocaleDateString()}</td>
                                <td className="py-2 px-4 border-b border-gray-700">{transaction.price} USD</td>
                                <td className="py-2 px-4 border-b border-gray-700">{transaction.payment_status}</td>
                                <td className="py-2 px-4 border-b border-gray-700">{transaction.transaction_reference}</td>
                                <td className="py-2 px-4 border-b border-gray-700">
                                    <a href={`/cars/${transaction.car.id}`}>view Car</a>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="py-2 px-4 text-center border-b border-gray-700">No transactions found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionTable;
