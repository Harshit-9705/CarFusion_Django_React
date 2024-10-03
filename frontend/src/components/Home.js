import React, { useEffect, useState } from 'react';
import aboutimg from '../images/About.jpg';
import carList from '../images/carListing.jpeg';
import signIn from '../images/SignIn.jpg';
import Buyed from '../images/Buyed.jpeg';
import SecurePay from '../images/SecurePayment.jpg'
import HappyCustomer from '../images/HappyCustomer.jpeg'
import RangeOfCarList from '../images/RangeOfCarList.jpg'
import Expert from '../images/Expert.jpeg'
import axios from 'axios';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const HomePage = () => {
    const [featuredCars, setFeaturedCars] = useState([]);
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const faqs = [
        {
            question: "How do I sign up?",
            answer: "You can sign up by clicking the 'Sign Up' button on our homepage and filling in your details."
        },
        {
            question: "How do I list my car for sale?",
            answer: "After signing up, you can navigate to the 'List Your Car' section and follow the instructions to provide details and photos of your car."
        },
        {
            question: "Is there a fee for using CarX?",
            answer: "No, we do not charge any fees for using our platform to buy or sell cars."
        },
        {
            question: "How do I contact customer support?",
            answer: "You can reach our customer support team through the contact form on our website or via email."
        }
    ];

    useEffect(() => {
        const fetchFeaturedCars = async () => {
            try {
                const response = await axios.get('http://localhost:8000/cars/', {
                    headers: {
                        Authorization: `Token ${localStorage.getItem('token')}`
                    }
                });
                const allCars = response.data;
                const randomCars = allCars.sort(() => 0.5 - Math.random()).slice(0, 4); // Randomly select 4 cars
                setFeaturedCars(randomCars);
            } catch (error) {
                console.error('Error fetching featured cars:', error);
            }
        };

        fetchFeaturedCars();
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };


    return (
        <div
            className="flex flex-col min-h-screen"
            style={{
                background: 'radial-gradient(circle, #2C2C2C 0%, #3A3A3A 40%, #1A1A1A 100%)',
            }}
        >
            {/* Header Section */}
            <section className="relative w-full">
                <div className="mt-10 inset-0 flex flex-col items-center justify-center text-center p-10">
                    <h1 className="text-5xl font-bold text-white">Welcome to CarFusion</h1>
                    <p className="text-xl text-gray-300 mt-4">Your trusted platform for buying and selling cars.</p>
                    <a href="/car-list" className="mt-6 inline-block bg-blue-500 text-white py-3 px-6 rounded hover:bg-blue-600 transition duration-200">
                        Browse Cars
                    </a>
                </div>
            </section>


            {/* Featured Section */}
            <section className="py-10 px-4">
                <h2 className="text-4xl font-bold text-white text-center">Featured Cars</h2>
                <p className="text-gray-300 text-center mt-2">Explore our top selections available for you.</p>
                <div className="flex flex-wrap justify-center mt-6">
                    {featuredCars.length > 0 ? (
                        featuredCars.map((car) => (
                            <div
                                key={car.id}
                                className="bg-[#2A2A2A] p-4 rounded-lg shadow-lg flex flex-col m-2 w-96"
                            >
                                <img
                                    src={`http://localhost:8000${car.image}`}
                                    alt={`Car Model ${car.make} ${car.model}`}
                                    className="w-full h-56 object-cover rounded-lg"
                                />
                                <h3 className="text-lg font-semibold text-gray-300 mt-2">{`${car.make} ${car.model}`}</h3>
                                <p className="text-gray-400">Price: ${car.price.toLocaleString()}</p>
                                <p className="text-gray-400">Location: {car.location}</p>
                                <a href={`/cars/${car.id}`} className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">
                                    View Details
                                </a>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400">No featured cars available at the moment.</p>
                    )}
                </div>
            </section>

            {/* About Section with Gradient Background */}
            <section className="py-10 px-4 bg-gradient-to-b from-[#2A2A2A] to-[#1A1A1A] mt-16">
                <h2 className="text-4xl font-bold text-white text-center">About Us</h2>
                <p className="text-gray-300 text-center mt-4 max-w-3xl mx-auto">
                    At CarFusion, we are dedicated to making the process of buying and selling cars as simple and transparent as possible.
                    Our platform connects buyers with sellers directly, ensuring a fair price and a smooth transaction.
                </p>
                <img
                    src={aboutimg}
                    alt="About CarX"
                    className="mt-6 mx-auto w-2/3 h-96 object-cover rounded-lg shadow-lg"
                />
            </section>

            {/* How It Works Section */}
            <section className="py-10 mt-16 px-4">
                <h2 className="text-4xl font-bold text-white text-center">How It Works</h2>
                <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-6">
                    <div className="bg-[#2A2A2A] p-6 rounded-lg text-center w-96">
                        <h3 className="text-xl font-semibold text-gray-300">1. Sign Up</h3>
                        <p className="text-gray-400 mt-2">Create an account to start buying or selling.</p>
                        <img
                            src={signIn}
                            alt="Sign Up"
                            className="mt-4 w-full h-56 object-cover"
                        />
                    </div>
                    <div className="bg-[#2A2A2A] p-6 rounded-lg text-center w-96">
                        <h3 className="text-xl font-semibold text-gray-300">2. List Your Car</h3>
                        <p className="text-gray-400 mt-2">Provide details and photos to list your car.</p>
                        <img
                            src={carList}
                            alt="List Your Car"
                            className="mt-4 w-full h-56 object-cover"
                        />
                    </div>
                    <div className="bg-[#2A2A2A] p-6 rounded-lg text-center w-96">
                        <h3 className="text-xl font-semibold text-gray-300">3. Connect with Buyers</h3>
                        <p className="text-gray-400 mt-2">Get inquiries and negotiate directly.</p>
                        <img
                            src={Buyed}
                            alt="Connect with Buyers"
                            className="mt-4 w-full h-56 object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* Promotions Section */}
            <section className="py-10 px-4 bg-[#1A1A1A] mt-20">
                <h2 className="text-4xl font-bold text-white text-center">Current Promotions</h2>
                <p className="text-gray-300 text-center mt-4">Check out our special offers!</p>
                <div className="flex flex-wrap justify-center mt-6">
                    {/* Promotion 1 */}
                    <div className="bg-[#2A2A2A] p-6 rounded-lg shadow-lg m-4 w-80">
                        <h3 className="text-xl font-semibold text-white">20% Off on First Purchase</h3>
                        <p className="text-gray-400">Sign up today and get 20% off your first car purchase!</p>
                    </div>

                    {/* Promotion 2 */}
                    <div className="bg-[#2A2A2A] p-6 rounded-lg shadow-lg m-4 w-80">
                        <h3 className="text-xl font-semibold text-white">Refer a Friend</h3>
                        <p className="text-gray-400">Refer a friend and both of you will receive $100 off your next purchase!</p>
                    </div>

                    {/* Promotion 6 */}
                    <div className="bg-[#2A2A2A] p-6 rounded-lg shadow-lg m-4 w-80">
                        <h3 className="text-xl font-semibold text-white">Seasonal Discounts</h3>
                        <p className="text-gray-400">Enjoy seasonal discounts on select models this month!</p>
                    </div>
                </div>
            </section>


            {/* Services Section */}
            <section className="py-10 px-4 mt-20">
                <h2 className="text-4xl font-bold text-white text-center">Our Services</h2>
                <p className="text-gray-300 text-center mt-4 max-w-3xl mx-auto">
                    We offer a range of services to ensure a smooth car buying and selling experience:
                </p>
                <div className="flex flex-wrap justify-center mt-6">
                    {/* Service Card 1 */}
                    <div className="bg-[#3A3A3A] p-6 rounded-lg shadow-lg m-4 text-center w-80 transition-transform transform hover:scale-105">
                        <img src={RangeOfCarList} alt="Vehicle Listings" className="mx-auto w-40 h-40 mb-4 rounded-full object-cover" />
                        <h3 className="text-xl font-semibold text-white">Comprehensive Listings</h3>
                        <p className="text-gray-400 mt-2">
                            Explore a wide range of vehicles with detailed descriptions and high-quality images.
                        </p>
                    </div>
                    {/* Service Card 2 */}
                    <div className="bg-[#3A3A3A] p-6 rounded-lg shadow-lg m-4 text-center w-80 transition-transform transform hover:scale-105">
                        <img src={SecurePay} alt="Secure Transactions" className="mx-auto w-40 h-40 mb-4 rounded-full object-cover" />
                        <h3 className="text-xl font-semibold text-white">Secure Transactions</h3>
                        <p className="text-gray-400 mt-2">
                            Enjoy peace of mind with our escrow service, ensuring safe and secure payments.
                        </p>
                    </div>
                    {/* Service Card 3 */}
                    <div className="bg-[#3A3A3A] p-6 rounded-lg shadow-lg m-4 text-center w-80 transition-transform transform hover:scale-105">
                        <img src={Expert} alt="Expert Advice" className="mx-auto w-40 h-40 mb-4 rounded-full object-cover" />
                        <h3 className="text-xl font-semibold text-white">Expert Guidance</h3>
                        <p className="text-gray-400 mt-2">
                            Our team of experts is here to help you navigate the buying and selling process.
                        </p>
                    </div>
                    {/* Service Card 4 */}
                    <div className="bg-[#3A3A3A] p-6 rounded-lg shadow-lg m-4 text-center w-80 transition-transform transform hover:scale-105">
                        <img src={HappyCustomer} alt="Exclusive Promotions" className="mx-auto w-40 h-40 mb-4 rounded-full object-cover" />
                        <h3 className="text-xl font-semibold text-white">Exclusive Promotions</h3>
                        <p className="text-gray-400 mt-2">
                            Gain access to special offers and discounts for our loyal customers.
                        </p>
                    </div>
                </div>
            </section>


            {/* FAQ Section */}
            <section className="py-10 px-4 text-white bg-[#1a1a1a] mt-20">
                <h2 className="text-4xl font-bold text-center">Frequently Asked Questions</h2>
                <div className="mt-6 max-w-3xl mx-auto">
                    {faqs.map((faq, index) => (
                        <div key={index} className="mb-4 border-b border-gray-600">
                            <button
                                onClick={() => toggleAccordion(index)}
                                className="w-full text-left py-4 text-xl font-semibold focus:outline-none"
                            >
                                {faq.question}
                            </button>
                            {activeIndex === index && (
                                <p className="text-gray-400 mt-2 mb-4">{faq.answer}</p>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            <section className="py-10 px-4 my-20">
    <h2 className="text-4xl font-bold text-white text-center">What Our Customers Say</h2>
    <div className="flex flex-wrap justify-center mt-6">
        <div className="bg-[#2A2A2A] p-6 rounded-lg shadow-lg m-4 w-80">
            <p className="text-gray-400">"I had a great experience buying my car from CarFusion! The process was smooth and easy."</p>
            <p className="text-gray-300 mt-4 font-semibold">- Alex R.</p>
        </div>
        <div className="bg-[#2A2A2A] p-6 rounded-lg shadow-lg m-4 w-80">
            <p className="text-gray-400">"Selling my car was a breeze. Highly recommend!"</p>
            <p className="text-gray-300 mt-4 font-semibold">- Maria L.</p>
        </div>
        <div className="bg-[#2A2A2A] p-6 rounded-lg shadow-lg m-4 w-80">
            <p className="text-gray-400">"Fantastic customer service and great deals!"</p>
            <p className="text-gray-300 mt-4 font-semibold">- John D.</p>
        </div>
    </div>
</section>
        </div>
    );
};

export default HomePage;
