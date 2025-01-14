import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiBook, FiDollarSign, FiLogIn } from 'react-icons/fi';
// import { IoMdAddCircleOutline } from "react-icons/io";
import { FaRegMessage } from "react-icons/fa6";
import image from '../assets/Letter E.png';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-sm sticky top-0 w-full z-10">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center">
          <Link to="" className="text-xl font-bold">
            <img className='h-9' src={image} alt="Logo" />
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-4">
          <Link
            to=""
            className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            <FiHome className="me-2 icon" />
            Home
          </Link>
          <Link
            to=""
            className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            <FiBook className="me-2 icon" />
            Expenses
          </Link>
          <Link
            to=""
            className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            <FaRegMessage className="me-2 icon" />
            Groups
          </Link>
          <Link
            to=""
            className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            <FiDollarSign size={19} className="me-2 icon" />
            Payments
          </Link>
        </div>

        {/* Profile and Login Section */}
        <div className="flex items-center">
          {/* <button className="px-3 py-2 mr-3 rounded-md text-gray-700 flex items-center hover:bg-gray-200">
            <FiBell size={19} className='mr-3' />
          </button> */}
          <Link
            to='/login'
            className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 flex items-center hover:bg-gray-200"
          >
            <FiLogIn className="mr-2" />
            Login
          </Link>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Link
          to=""
          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200"
        >
          <FiHome className="me-2 icon" />
          Home
        </Link>
        <Link
          to=""
          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200"
        >
          <FiBook className="me-2 icon" />
          Expenses
        </Link>
        <Link
          to=""
          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200"
        >
          <FaRegMessage className="me-2 icon" />
          Groups
        </Link>
        <Link
          to=""
          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200"
        >
          <FiDollarSign size={19} className="me-2 icon" />
          Payments
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
