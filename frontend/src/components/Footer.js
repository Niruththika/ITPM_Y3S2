// import React from 'react'

// const Footer = () => {
//   return (
//     <footer className='bg-slate-200'>
//       <div className='container mx-auto p-4'>
//        <p className='text-center font-bold' title="Youtube Channel">Dynamic Coding with Amit</p>
//       </div>
//     </footer>
//   )
// }

// export default Footer

import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaCcPaypal, FaCcMastercard, FaCreditCard } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className='bg-slate-200 py-4'>
      <div className='container mx-auto flex flex-col md:flex-row justify-between items-center px-4'>
        
        {/* Left Side: Payment Methods */}
        <div className='flex gap-3 text-2xl'>
          <FaCcPaypal className="text-blue-600" />
          <FaCcMastercard className="text-red-600" />
          <FaCreditCard className="text-gray-700" />
        </div>

        {/* Center: Copyright Text */}
        <p className='text-sm font-bold text-center mt-2 md:mt-0'>
          &copy; {new Date().getFullYear()} Amit eCommerce. All rights reserved.
        </p>

        {/* Right Side: Social Media Icons */}
        <div className='flex gap-3 text-2xl mt-2 md:mt-0'>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="hover:text-red-500 transition" />
          </a>
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebook className="hover:text-blue-600 transition" />
          </a>
          <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="hover:text-blue-400 transition" />
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
