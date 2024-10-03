import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Footer = () => {
    return (
        <footer className=" bg-[#1A1A1A] text-white py-12 ">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold mb-4">CarFusion</h2>
                        <p className="text-sm mb-2">© {new Date().getFullYear()} Your Company. All rights reserved.</p>
                        <p className="text-sm">1234 Shivranjani, Satelite Road, Ahmedabad, 380015</p>
                        <p className="text-sm">Email: info@CarFusion.com</p>
                        <p className="text-sm">Phone: 9864756122</p>
                    </div>

                    {/* Quick Links Section */}
                    <div className="mb-6">
                        <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="/" className="hover:text-gray-300 transition duration-300">Home</a>
                            </li>
                            <li>
                                <a href="car-list" className="hover:text-gray-300 transition duration-300">View Cars</a>
                            </li>
                            <li>
                                <a href="/profile" className="hover:text-gray-300 transition duration-300">Profile</a>
                            </li>
                            <li>
                                <a href="liked-car" className="hover:text-gray-300 transition duration-300">Liked Car</a>
                            </li>
                        </ul>
                    </div>

                    {/* Social Media Links Section */}
                    <div className="mb-6">
                        <h3 className="text-lg font-bold mb-4">Follow Us</h3>
                        <div className="flex flex-col space-y-2">
                            <a href="#" className="flex items-center hover:text-gray-300 transition duration-300">
                                <i className="fab fa-facebook-f text-xl mr-2"></i>
                                Facebook
                            </a>
                            <a href="#" className="flex items-center hover:text-gray-300 transition duration-300">
                                <i className="fab fa-twitter text-xl mr-2"></i>
                                Twitter
                            </a>
                            <a href="#" className="flex items-center hover:text-gray-300 transition duration-300">
                                <i className="fab fa-instagram text-xl mr-2"></i>
                                Instagram
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
