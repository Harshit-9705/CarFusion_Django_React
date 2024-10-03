import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaHeart, FaEnvelope, FaGasPump, FaTachometerAlt, FaMapMarkerAlt } from 'react-icons/fa';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useNavigate } from 'react-router-dom';

const CarDetails = () => {
    const { id } = useParams();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [suggestedCars, setSuggestedCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ comment: '', rating: 1 });
    const [searchTerm, setSearchTerm] = useState('');
    const [images, setImages] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const [amount, setAmount] = useState(0)
    const [sold, setSold] = useState(false)
    const [contactForm, setContactForm] = useState({
        message: '',
    });
    const [alertError, setalertError] = useState("");
    const [alertMessage, setAlertMessage] = useState("");

    const [user, setUser] = useState(null);
    const navigate = useNavigate()
    useEffect(()=>{
        if(!localStorage.getItem("token")){
            navigate("/login")
        }
    })


    const handleContactSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:8000/queries/${id}/`, {
                content: contactForm.message,
            }, {
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`,
                },
            });

            setContactForm({ message: '' });
            setAlertMessage("Message send SuccessFully")
        } catch (error) {
            console.error('Error sending query:', error);
            setalertError(error.response.data.error)
        }
    };

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.type = 'text/javascript';
        script.onload = () => {
            console.log('Razorpay script loaded');
        };
        script.onerror = () => {
            console.error('Failed to load Razorpay script');
            setalertError('Failed to load payment gateway. Please try again.');
        };
        document.body.appendChild(script);
    
    }, []);
    
    

    useEffect(() => {
        const fetchCarDetails = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setalertError("please Login First")
                return
            }
            try {
                const [carResponse, suggestedResponse, reviewsResponse, imagesResponse, userProfile] = await Promise.all([
                    axios.get(`http://127.0.0.1:8000/cars/${id}/`),
                    axios.get(`http://127.0.0.1:8000/carsSuggestion/${id}/`),
                    axios.get(`http://127.0.0.1:8000/cars/${id}/reviews/`, {
                        headers: { 'Authorization': `Token ${token}` },
                    }),
                    axios.get(`http://127.0.0.1:8000/cars/${id}/images/`),
                    axios.get('http://localhost:8000/profile/', {
                        headers: {
                            'Authorization': `Token ${token}`,
                        },
                    })
                ]);

                setCar(carResponse.data);
                setSuggestedCars(suggestedResponse.data);
                setFilteredCars(suggestedResponse.data);
                setReviews(reviewsResponse.data);
                setImages(imagesResponse.data);
                setAmount(carResponse.data.price)
                setSold(carResponse.data.is_sold)
                setUser(userProfile.data)
            } catch (err) {
                setalertError(err.response?.data || 'Error fetching car details.');
            } finally {
                setLoading(false);
            }
        };

        fetchCarDetails();
    }, [id]);

    const applyFilters = () => {
        let filtered = suggestedCars;

        if (searchTerm) {
            filtered = filtered.filter(car =>
                `${car.make} ${car.model} ${car.location}`.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }


        setFilteredCars(filtered);
    };



    useEffect(() => {
        applyFilters();
    }, [searchTerm]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('No token found, user may not be authenticated.');
            setalertError("please Login First")
            return;
        }

        try {
            console.log(id)
            const response = await axios.post(`http://127.0.0.1:8000/cars/${id}/reviews/`, {
                comment: newReview.comment,
                rating: newReview.rating,
            }, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });
            console.log(id)

            setReviews(prevReviews => [...prevReviews, response.data]);
            setNewReview({ comment: '', rating: 1 });
            setAlertMessage("ReView Added SuccessFully")
        } catch (error) {
            console.error('Error submitting review:', error.response?.data || error);
            setalertError(error.response.data.error)

        }
    };


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


    const handleLikeCar = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setalertError("please Login First")
            return
        }
        try {

            await axios.post(`http://localhost:8000/liked-cars/`, { "car": id }, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });
            setIsLiked(true);
            setAlertMessage("Liked SuccessFully")

        } catch (error) {
            setalertError(error.response.data.detail)

        }
    };

    if (loading) return <div className="loading text-gray-700">Loading...</div>;
    if (error) return <div className="error text-red-500">{error}</div>;
    if (!car) return null;

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1, 
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1000,
    };


    const handlePayment = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setalertError("please Login First")
                return
            }
            const orderResponse = await axios.post('http://localhost:8000/create-order/', {
                amount: amount * 100, 
                car_id: id
            }, {
                headers: {  
                    'Authorization': `Token ${token}`,
                }
            });


            const options = {
                key: 'rzp_test_SFOhhro14prUsF',
                amount: orderResponse.data.amount,
                currency: "INR",
                name: 'CarFusion',
                description: 'Test Transaction',
                order_id: orderResponse.data.id,
                handler: async (response) => {
                    try {
                        await axios.post('http://localhost:8000/verify-payment/', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            car_id: id, 
                        }, {
                            headers: {  
                                'Authorization': `Token ${token}`,
                            }
                        }
                        );
                        alert('Payment Successful!');
                        setAlertMessage('Payment Successful!');
                    } catch (error) {
                        console.error('Payment verification failed:', error);
                        setalertError(error.response.data.status)
                    }
                },
                prefill: {
                    name: user.user.username.split("_")[0] || "Customer Name",
                    email: user.email || 'customer@example.com',
                    contact: user.contact || '9429087910',
                },
                theme: {
                    color: '#1A1A1A',
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        
        } catch (error) {
            console.error('Error during payment:', error.response?.data || error);
            setalertError(error.response.data.error)
        }
    }



    return (
        <div className="overflow-x-hidden container-fluid" style={{ background: 'radial-gradient(circle, #2C2C2C 0%, #3A3A3A 40%, #333333 75% ,#222222 100%)' }}>


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



            <div className="flex flex-col lg:flex-row bg-[#1a1a1a] xl:px-28 xl:py-10 py-6 px-8 xl:gap-2 gap-4 2xl:px-52 2xl:py-8 shadow-lg" style={{minHeight : "calc(100vh - 64px"}}>  {/* Main container background */}
                {/* Car Image Section */}
                <div className="lg:w-3/4 w-full">
                    <img
                        src={`http://localhost:8000/${car.image}`}
                        alt={`${car.make} ${car.model}`}
                        className="w-full h-full rounded-lg"
                    />
                </div>

                {/* Car Details Section */}
                <div className="lg:w-1/2 mt-2 rounded-t-lg xl:p-10 bg-transperant transform transition-transform hover:scale-105 flex justify-center flex-col items-center">
                    <h1 className="text-4xl font-bold mb-4 text-white text-center">{`${car.make} ${car.model}`}</h1>
                    <p className="text-gray-300 mb-4 text-center">{car.description}</p>
                    <p className="text-3xl font-bold text-white mb-3 text-center">{`₹${car.price}`}</p>

                    {/* Specifications Section */}
                    <h2 className="text-2xl font-bold mb-2 mt-5 text-gray-300 text-center">Specifications</h2>
                    <ul className="list-none pl-6 text-gray-200 mb-4 text-center">
                        <li>{`Year: ${car.year}`}</li>
                        <li>{`Transmission: ${car.transmission}`}</li>
                        <li>{`Mileage: ${car.mileage} km`}</li>
                        <li>{`Condition: ${car.condition}`}</li>
                        <li>{`Number of Doors: ${car.number_of_doors}`}</li>
                        <li>{`Location: ${car.location}`}</li>
                        <li>{`Fuel Type: ${car.fuel_type}`}</li>
                        <li>{`Color: ${car.color}`}</li>
                    </ul>

                    {/* Owner's Information */}
                    <h2 className="text-2xl font-bold mb-2 mt-5 text-gray-300 text-center">Owner's Information</h2>
                    <p className="text-gray-200 mb-1 text-center">Name: {car.seller.user.username}</p>
                    <p className="text-gray-200 mb-1 text-center">Contact: {car.seller.email}</p>
                    <p className="text-gray-200 mb-1 text-center">Address: {car.seller.address}</p>
                    <p className="text-gray-200 mb-1 text-center">City: {car.seller.city}</p>

                    {/* Buttons Section */}
                    <div className="flex justify-center gap-3 mt-7">
                        <button
                            className={`bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded flex items-center transition duration-200 shadow-md transform hover:scale-105 ${sold ? "opacity-50 cursor-not-allowed" : ""}`}
                            onClick={sold ? null : handlePayment} // Prevents click if sold
                            disabled={sold} // Sets the button to be disabled if sold
                        >
                            <FaEnvelope className="mr-2" /> {sold ? 'Sold' : 'Buy Now'}
                        </button>

                        <button
                            className={`flex items-center py-2 px-4 rounded text-white transition duration-200 bg-red-600 hover:bg-red-800 shadow-md transform hover:scale-105`}
                            onClick={handleLikeCar}
                        >
                            <FaHeart className="mr-2" />Add to Favorites
                        </button>
                    </div>
                </div>

            </div>

            {/* Customer Reviews Section */}
            <div className=" bg-transperant sm:p-14 xl:px-28 xl:py-10 p-10 2xl:px-52 2xl:py-20"> {/* Customer Reviews section background */}
                <h2 className="text-3xl font-bold mb-6 text-gray-300">Customer Reviews</h2> {/* Title color */}
                {reviews.length > 0 ? (
                    reviews.map(review => (
                        <div key={review.id} className="bg-[#1A1A1A] p-4 rounded-lg shadow-md mb-4"> {/* Review card background */}
                            <h3 className="font-semibold text-white">{review.user?.username || 'Anonymous'}</h3> {/* Username color */}
                            <p className="text-gray-200">{review.comment}</p> {/* Comment color */}
                            <p className="text-yellow-500">{`Rating: ${'⭐'.repeat(review.rating)}`}</p> {/* Rating color */}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400">No reviews yet.</p>
                )}

                {/* Review Submission Form */}
                <form onSubmit={handleReviewSubmit} className="mt-4">
                    <textarea
                        className="w-full p-2 bg-[#1A1A1A] text-gray-300 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" // Updated colors
                        placeholder="Write your review..."
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        required
                    />
                    <div className="flex items-center mt-2">
                        <label className="mr-2 text-gray-300">Rating:</label> {/* Label color */}
                        <select
                            className="bg-[#1A1A1A] text-gray-300 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" // Updated colors
                            value={newReview.rating}
                            onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                        >
                            {[1, 2, 3, 4, 5].map(rating => (
                                <option key={rating} value={rating} className="bg-[#1A1A1A] text-gray-300">{rating}</option> // Updated options color
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="mt-4 bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
                    >
                        Submit Review
                    </button>
                </form>
            </div>

            {/* Image Carousel Section */}
            <div className="w-full mx-auto sm:p-14 p-10 bg-transparent xl:px-28 2xl:px-52 2xl:py-20 lg:min-h-screen  items-center">
                <h2 className="text-3xl font-bold text-gray-300 mb-2">Gallery</h2>
                <p className="text-gray-400 mb-8">Check out the images of this car from different angles.</p>

                <div className="h-full">
                    {images.length > 0 ? (
                        <Slider {...settings}>
                            {images.map((image, index) => (
                                <div key={index} className="flex justify-center items-center">
                                    <img
                                        src={`http://localhost:8000${image.image_data}`}
                                        alt={`Car Image ${index + 1}`} // More descriptive alt text
                                        className="w-full md:h-[700px]  rounded-md" // Increased height to 500px
                                        loading="lazy" 
                                    />
                                </div>
                            ))}
                        </Slider>
                    ) : (
                        <div className="flex justify-center items-center h-[500px]"> {/* Match placeholder height */}
                            <h1 className='text-3xl font-bold text-gray-400'>No Images Available</h1>
                        </div>
                    )}
                </div>
            </div>


            {/* Suggested Cars Section */}
            <div className="w-full  sm:p-8 bg-transperant xl:px-28 xl:py-10 p-8 2xl:px-52 2xl:py-20">
                <h2 className="text-3xl font-bold mb-6 text-gray-300 px-4">You May Also Like</h2>

                {/* Search Bar */}
                <div className="p-4">
                    <input
                        type="text"
                        placeholder="Search by make, model, or city..."
                        className="border rounded w-full p-4 border-none transition duration-200 bg-[#1A1A1A] text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6 m-4 px-4">
                    {filteredCars.slice(0, 3).map(suggestedCar => (
                        <li key={suggestedCar.id}>
                            <div className="featublue-car-card bg-[#2A2A2A] hover:bg-transperant hover:shadow-none rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-95 duration-200">
                                <figure className="card-banner">
                                    <img
                                        src={`http://127.0.0.1:8000${suggestedCar.image}`}
                                        alt={`${suggestedCar.make} ${suggestedCar.model}`}
                                        loading="lazy"
                                        className="w-full h-64 rounded-lg"
                                    />
                                </figure>

                                <div className="card-content p-4">
                                    <div className="card-title-wrapper flex justify-between items-center mb-2">
                                        <h3 className="h3 card-title">
                                            <a href={`/cars/${suggestedCar.id}`} className="text-lg font-semibold text-gray-300 hover:text-gray-400 transition duration-200">{`${suggestedCar.make} ${suggestedCar.model}`}</a>
                                        </h3>
                                        <data className="year text-gray-500" value={suggestedCar.year}>{suggestedCar.year}</data>
                                    </div>

                                    <ul className="card-list list-none mb-4">
                                        <li className="card-list-item flex items-center mb-1">
                                            <FaMapMarkerAlt className="mr-2 text-blue-500" />
                                            <span className="card-item-text text-gray-300">{`${suggestedCar.location}`}</span>
                                        </li>
                                        <li className="card-list-item flex items-center mb-1">
                                            <FaGasPump className="mr-2 text-blue-500" />
                                            <span className="card-item-text text-gray-300">{suggestedCar.fuel_type}</span>
                                        </li>
                                        <li className="card-list-item flex items-center mb-1">
                                            <FaTachometerAlt className="mr-2 text-blue-500" />
                                            <span className="card-item-text text-gray-300">{`${suggestedCar.mileage} km`}</span>
                                        </li>
                                    </ul>

                                    <div className="card-price-wrapper flex items-center justify-between mt-4">
                                        <p className="card-price text-lg font-bold text-blue-500">
                                            <strong>₹{suggestedCar.price.toLocaleString()}</strong>
                                        </p>

                                        <a href={`/cars/${suggestedCar.id}`} className="btn bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">
                                            View Now
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="bg-transparent mb-20 xl:px-28 xl:py-10 p-8 2xl:px-52 2xl:py-20">
                <form onSubmit={handleContactSubmit} className="w-full">
                    <h2 className="text-2xl font-bold mb-4 text-gray-300 text-center">Ask Query the Owner</h2>

                    <div className="mb-3">
                        <label className="block text-gray-200 mb-1">Message</label>
                        <textarea
                            className={`w-full p-3 bg-[#1A1A1A] text-gray-300 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            value={contactForm.message}
                            onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-200 w-full"
                    >
                        Send Message
                    </button>
                </form>
            </div>
        </div>


    );
};

export default CarDetails;
