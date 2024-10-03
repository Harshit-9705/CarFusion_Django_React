import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from './axiosInstance';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [userType, setUserType] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLinkShow, setIsLinkShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axiosInstance.get('/profile/');
          if (response.data.user) {
            setUsername(response.data.user.username);
            setProfilePic(response.data.profile_pic);
            setUserType(response.data.user_type);
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error.response || error.message);
          setIsLoggedIn(false);
        }
      }
    };

    checkLoginStatus();
  });

  useEffect(() => {
    const handleResize = () => {
      setIsLinkShow(window.innerWidth > 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      try {
        await axiosInstance.post('/logout/');
        localStorage.removeItem('token');
        localStorage.removeItem('activeSection');
        setIsLoggedIn(false);
        setUsername('');
        setProfilePic('');
        setUserType('');
        setIsMobileMenuOpen(false); // Close mobile menu on logout
        navigate('/login');
      } catch (error) {
        console.error('Error during logout:', error.response || error.message);
      }
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false); }

  return (
    <nav className="bg-[#1A1A1A] p-4 sticky z-10 top-0 left-0 ">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold" onClick={closeMobileMenu}>
          CarFusion
        </Link>

        {/* Mobile Menu Button */}
        <div className='flex flex-col md:flex-row justify-center items-center'>
          <button
            className="lg:hidden flex justify-center items-center w-8 h-8 text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {isMobileMenuOpen && (
            <div className={`absolute top-14 w-full right-0 bg-[#1a1a1a] flex flex-col justify-center items-center p-10 gap-7 transition-transform duration-1500 ease-in-out`}>
              <span className="text-white">Welcome, {username}</span>
              <Link to="/" className="text-white hover:text-gray-400" onClick={closeMobileMenu}>Home</Link>
              
              <Link to="/car-list" className="text-white hover:text-gray-400" onClick={closeMobileMenu}>View Cars</Link>
              {userType === 'seller' && (
                <Link to="/car-register" className="text-white hover:text-gray-400" onClick={closeMobileMenu}>Register Car</Link>
              )}
              {userType === 'buyer' && (
                <Link to="/liked-car" className="text-white hover:text-gray-400" onClick={closeMobileMenu}>Liked Car</Link>
              )}
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMobileMenu(); 
                    }}
                    className="text-white hover:text-gray-400"
                  >
                    Logout
                  </button>
                  <div className="flex items-center">
                    <a href="/profile" onClick={closeMobileMenu}>
                      {profilePic && <img src={`http://localhost:8000/${profilePic}/`} alt={username[0]} className="w-8 h-8 rounded-full mr-2" />}
                      {!profilePic && <div className='w-10 h-10 rounded-full p-4'>{username[0]}</div>}
                    </a>
                  </div>

                </>
              ) : (
                <>
                  <Link to="/signup" className="text-white hover:text-gray-400" onClick={closeMobileMenu}>Sign Up</Link>
                  <Link to="/login" className="text-white hover:text-gray-400" onClick={closeMobileMenu}>Login</Link>
                </>
              )}
            </div>
          )}

          {isLinkShow && (
            <div className={`flex justify-between items-center gap-7`}>
              <span className="text-white">Welcome, {username}</span>
              <Link to="/" className="text-white hover:text-gray-400">Home</Link>

              {userType === 'buyer' && (             
                <Link to="/liked-car" className="text-white hover:text-gray-400">Liked Car</Link>
              )}
              <Link to="/car-list" className="text-white hover:text-gray-400">View Cars</Link>
              {userType === 'seller' && (
                <Link to="/car-register" className="text-white hover:text-gray-400">Register Car</Link>
              )}
              {isLoggedIn ? (
                <>
                  <button
                    onClick={handleLogout}
                    className="text-white hover:text-gray-400"
                  >
                    Logout
                  </button>
                  <div className="flex items-center">
                    <a href="/profile" onClick={closeMobileMenu}>
                      {profilePic && <img src={`http://localhost:8000/${profilePic}/`} alt={"profile"} className="w-8 h-8 rounded-full mr-2" />}
                      {!profilePic && <div className='w-10 h-10 bg-[#3a3a3a] text-white rounded-full font-bold flex items-center justify-center text-2xl text-center'>{username[0]}</div>}
                    </a>
                  </div>

                </>
              ) : (
                <>
                  <Link to="/signup" className="text-white hover:text-gray-400">Sign Up</Link>
                  <Link to="/login" className="text-white hover:text-gray-400">Login</Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
