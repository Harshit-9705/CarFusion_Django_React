import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';
import ProfileDetails from './ProfiileDetails';
import UpdateProfileForm from './UpdateProfileForm';
import LikedCarsTable from './LikedCarTable';
import ResponsesContainer from './ResponseContainer';
import ReviewContainer from './ReviewContainer';
import SoldCarsTable from './SoldCarTable';
import UnsoldCarsTable from './UnsoldCarTable';
import QueriesContainer from './QueriesList';
import TransactionTable from './TransactionTable';
import BoughtCarsTable from './BoughtCarTable';
import { useNavigate } from 'react-router-dom';

const UserProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({
        address: '',
        city: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [image, setImage] = useState();
    const [carsSold, setCarsSold] = useState([]);
    const [unsoldCars, setUnsoldCars] = useState([]);
    const [likedCars, setLikedCars] = useState([]);
    const [activeSection, setActiveSection] = useState(localStorage.getItem("activeSection") || "profile");
    const [queries, setQueries] = useState([]);
    const [response, setResponse] = useState({});
    const [responses, setResponses] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null);
    const [selectedBuyer, setSelectedBuyer] = useState(null);
    const [selectedSeller, setSelectedSeller] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [showImageUploader, setShowImageUploader] = useState(null);
    const [alertError, setalertError] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [transactions, setTransactions] = useState([]);
    const [boughtCars, setBoughtCars] = useState([]);

    const navigate = useNavigate()
    useEffect(()=>{
        if(!localStorage.getItem("token")){
            navigate("/login")
        }
    })


    const toggleImageUploader = (carId) => {
        setShowImageUploader((prev) => (prev === carId ? null : carId));
    };

    useEffect(() => {
        localStorage.setItem('activeSection', activeSection);
    }, [activeSection]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axiosInstance.get('/transactions/');
                setTransactions(response.data);
            } catch (error) {
                console.log('Failed to fetch transactions:', error);
                setError('Failed to fetch transactions');
            }
        };

        if (profile) {
            fetchTransactions();
        }
    }, [profile]);


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axiosInstance.get('/profile/');
                setProfile(response.data);
                setFormData({
                    address: response.data.address || '',
                    city: response.data.city || '',
                });
                setCarsSold(response.data.cars_sold || []);
                setUnsoldCars(response.data.buyed || []);
                setBoughtCars(response.data.cars_bought || [])
            } catch (error) {
                setError('Failed to fetch profile data');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);


    useEffect(() => {
        const fetchLikedCars = async () => {
            try {
                const response = await axiosInstance.get('/liked-cars/');
                const formattedLikedCars = response.data.map(item => ({
                    carId: item.car.id,
                    carMake: item.car.make,
                    carModel: item.car.model,
                    carPrice: item.car.price,
                    carYear: item.car.year,
                    sellerUsername: item.car.seller.user.username,
                    sellerProfilePic: item.car.seller.profile_pic,
                    sellerEmail: item.car.seller.email,
                    mileage: item.car.mileage
                }));

                setLikedCars(formattedLikedCars);
            } catch (error) {
                console.log(error)
            }
        };

        fetchLikedCars();
    }, [localStorage.getItem('token')]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            address: formData.address,
            city: formData.city,
        };

        const formDataToSend = new FormData();
        for (const key in payload) {
            formDataToSend.append(key, payload[key]);
        }

        if (image) {
            formDataToSend.append('profile_pic', image);
        }

        try {
            const response = await axiosInstance.put('/profile/', formDataToSend, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`,
                },
            });
            setProfile(response.data);
            setAlertMessage("Profile updated successfully")
        } catch (error) {
            setalertError(error.response.data.detail)
        }
    };

    const handleRemoveCar = async (carId) => {
        try {
            await axiosInstance.delete(`/liked-cars/${carId}/`);
            setLikedCars(likedCars.filter(car => car.carId !== carId));
            setAlertMessage("Car Removed SuccessFully")
        } catch (error) {
            setalertError(error.response.data.detail)
        }
    };


    useEffect(() => {
        const fetchQueriesAndResponses = async () => {
            try {
                const response = await axiosInstance.get('/queries/');
                setQueries(response.data);
                setResponses(response.data)
            } catch (error) {
                setError('Failed to fetch queries/responses');
            }
        };

        if (profile) {
            fetchQueriesAndResponses();
        }
    }, [profile]);


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

    const handleResponseChange = (queryId, value) => {
        setResponse(prev => ({ ...prev, [queryId]: value }));
    };



    const handleQuerySubmit = async (queryId) => {
        try {
            await axiosInstance.post(`/queries/response/${queryId}/`, { content: response[queryId] });
            setQueries(prev => prev.filter(query => query.id !== queryId));
            setAlertMessage("Submitted SuccessFully")
        } catch (error) {
            console.error('Error responding to query:', error);
            setalertError(error.response.data.error)
        }
    };


    const handleDeleteCar = async (carId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this car?");
        if (!confirmDelete) return;

        try {
            await axiosInstance.delete(`/cars/${carId}/`);
            setUnsoldCars(unsoldCars.filter(car => car.id !== carId));
            setAlertMessage("Car Deleted SuccessFully")
        } catch (error) {
            console.error('Error deleting car:', error);
            setalertError(error.response.data.error)


        }
    };


    const handleCarClick = async (car) => {
        try {
            const response = await axiosInstance.get(`/cars/${car.id}/reviews/`);
            setReviews(response.data);
            setSelectedCar(car);
            console.log(selectedCar)
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        }
    };


    const renderSection = () => {
        switch (activeSection) {
            case 'profile':
                return (
                    <div className="p-5 h-screen">
                        <h2 className="text-3xl font-bold mb-6 text-white text-center">User Details</h2>
                        <ProfileDetails profile={profile} formData={formData} />
                        <UpdateProfileForm
                            handleSubmit={handleSubmit}
                            handleImageChange={handleImageChange}
                            formData={formData}
                            handleChange={handleChange}
                        />
                    </div>
                );
            case 'likedCars':
                return (
                    <div className="h-screen p-5">
                        <h2 className={`text-2xl font-bold mb-3 text-white`}>Liked Cars:</h2>
                        {likedCars.length > 0 ? (
                            <LikedCarsTable likedCars={likedCars} handleRemoveCar={handleRemoveCar} />
                        ) : (
                            <p >No liked cars.</p>
                        )}
                    </div>
                );
            case 'carsSold':
                return (
                    <div className="h-screen p-5">
                        <h2 className="text-2xl font-bold mb-3 text-white">Cars Sold:</h2>
                        {carsSold.length > 0 ? (
                            <SoldCarsTable carsSold={carsSold}  />
                        ) : (
                            <p className="text-white">No cars sold.</p>
                        )}
                    </div>
                );
            case 'unSold':
                return (
                    <div className="h-screen p-5">
                        <h2 className="text-2xl font-bold mb-3 text-white">Unsold Cars:</h2>
                        {unsoldCars.length > 0 ? (
                            <UnsoldCarsTable
                                unsoldCars={unsoldCars}
                                handleDeleteCar={handleDeleteCar}
                                toggleImageUploader={toggleImageUploader}
                                showImageUploader={showImageUploader}
                            />
                        ) : (
                            <p className="text-white">No unsold cars available.</p>
                        )}
                    </div>
                );
            case 'queries':
                return (
                    <QueriesContainer
                        queries={queries}
                        selectedBuyer={selectedBuyer}
                        setSelectedBuyer={setSelectedBuyer}
                        response={response}
                        handleResponseChange={handleResponseChange}
                        handleQuerySubmit={handleQuerySubmit}
                    />
                );
            case 'responses':
                return (
                    <ResponsesContainer
                        responses={responses}
                        selectedSeller={selectedSeller}
                        setSelectedSeller={setSelectedSeller}
                    />
                );
            case "review":
                return (
                    <ReviewContainer
                        selectedCar={selectedCar}
                        unsoldCars={unsoldCars}
                        handleCarClick={handleCarClick}
                        reviews={reviews}
                        setSelectedCar={setSelectedCar}
                    />
                );
            case 'transactions':
                return (
                    <div className="h-screen p-5">
                        <h2 className="text-2xl font-bold mb-3 text-white ">Transactions:</h2>
                        {transactions.length > 0 ? (
                            <TransactionTable transactions={transactions} />
                        ) : (
                            <p className="text-white">No transactions found.</p>
                        )}
                    </div>
                );
            case 'boughtCars':
                return (
                    <div className="h-screen p-5">
                        <h2 className="text-2xl font-bold mb-3 text-white">Bought Cars:</h2>
                        {boughtCars.length > 0 ? (
                            <BoughtCarsTable boughtCars={boughtCars} />
                        ) : (
                            <p className="text-white">No bought cars found.</p>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className={`min-h-screen 'bg-gradient-to-b from-[#222222] via-[#2a2a2a] to-[#3a3a3a]' flex flex-col lg:flex-row`}>

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
            <nav className="bg-[#333333] w-full lg:w-1/5 p-5 lg:sticky lg:top-16 lg:h-screen z-5">
                <h2 className="text-xl font-bold text-white mb-5">Navigation</h2>
                <ul className="space-y-3">
                    <li>
                        <button
                            onClick={() => setActiveSection('profile')}
                            className={`text-white hover:bg-blue-500 px-4 py-2 rounded-md w-full text-left ${activeSection === 'profile' ? 'bg-blue-500' : ''}`}
                        >
                            Profile
                        </button>
                    </li>
                    {profile?.user_type === 'seller' && (
                        <>
                            <li>
                                <button
                                    onClick={() => setActiveSection('carsSold')}
                                    className={`text-white hover:bg-blue-500 px-4 py-2 rounded-md w-full text-left ${activeSection === 'carsSold' ? 'bg-blue-500' : ''}`}
                                >
                                    Cars Sold
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setActiveSection('unSold')}
                                    className={`text-white hover:bg-blue-500 px-4 py-2 rounded-md w-full text-left ${activeSection === 'unSold' ? 'bg-blue-500' : ''}`}
                                >
                                    Unsold Cars
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setActiveSection('review')}
                                    className={`text-white hover:bg-blue-500 px-4 py-2 rounded-md w-full text-left ${activeSection === 'review' ? 'bg-blue-500' : ''}`}
                                >
                                    Check Reviews
                                </button>

                            </li>
                        </>
                    )}
                    <li>
                        {profile?.user_type === 'seller' && (
                            <button
                                onClick={() => setActiveSection('queries')}
                                className={`text-white hover:bg-blue-500 px-4 py-2 rounded-md w-full text-left ${activeSection === 'queries' ? 'bg-blue-500' : ''}`}
                            >
                                <div className="flex justify-between items-center">
                                    Incoming Queries
                                    {(queries.length > 0) && (
                                        <span className={`w-6 h-6 text-center rounded-full ${activeSection === 'queries' ? 'bg-white text-blue-500 font-bold' : 'bg-blue-500'}`}>{queries.length}</span>
                                    )}
                                </div>
                            </button>
                        )}
                    </li>


                    {profile?.user_type === 'buyer' && (
                        <>
                            <li>
                                <button
                                    onClick={() => setActiveSection('responses')}
                                    className={`text-white hover:bg-blue-500 px-4 py-2 rounded-md w-full text-left ${activeSection === 'responses' ? 'bg-blue-500' : ''}`}
                                >
                                    <div className="flex justify-between items-center">
                                        Incoming Response
                                        {(queries.length > 0) && (
                                            <span className={`ml-2 w-6 h-6 text-center rounded-full ${activeSection === 'responses' ? 'bg-white text-blue-500 font-bold' : 'bg-blue-500'}`}>{queries.length}</span>
                                        )}
                                    </div>
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setActiveSection('likedCars')}
                                    className={`text-white hover:bg-blue-500 px-4 py-2 rounded-md w-full text-left ${activeSection === 'likedCars' ? 'bg-blue-500' : ''}`}
                                >
                                    Liked Cars
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setActiveSection('boughtCars')}
                                    className={`text-white hover:bg-blue-500 px-4 py-2 rounded-md w-full text-left ${activeSection === 'boughtCars' ? 'bg-blue-500' : ''}`}
                                >
                                    Bought Cars
                                </button>
                            </li>
                        </>
                    )}
                    <li>
                        <button
                            onClick={() => setActiveSection('transactions')}
                            className={`text-white hover:bg-blue-500 px-4 py-2 rounded-md w-full text-left ${activeSection === 'transactions' ? 'bg-blue-500' : ''}`}
                        >
                            Transactions
                        </button>
                    </li>
                </ul>
            </nav>

            {/* Main Content Area */}
            <div className="flex-1 p-5 md:ml-1/4 mt-0 md:mt-0 md:pl-5">
                    
                {loading ? (
                    <p className="text-white">Loading...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    renderSection()
                )}
            </div>
        </div>
    );

};

export default UserProfilePage;
