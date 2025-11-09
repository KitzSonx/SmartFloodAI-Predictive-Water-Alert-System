// Footer.js

import React from "react";
import { FiPhone, FiMail, FiMapPin, FiGlobe } from 'react-icons/fi'; 
import CRMS6_logo from "../../assets/CRMS6_logo.png";
import logo from "../../assets/logo.png";
import VisitorCounters from "../VisitorCounters.jsx";

const Footer = () => {
  return (
    <footer className="bg-gray-900/50 backdrop-blur-sm text-gray-300">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          
          <div className="md:col-span-1 lg:col-span-2">
            <div className="flex items-center">
              <img 
                src={logo} 
                alt="AI Water Logo" 
                className="h-16 mr-4 bg-white p-2 rounded-full"
              />
              <div>
                <h3 className="text-xl font-bold text-white">Smart Flood Project</h3>
                <p className="text-sm text-gray-400 mt-1">
                  ระบบทำนายและแจ้งเตือนระดับน้ำอัจฉริยะ
                </p>
              </div>
            </div>
          </div>

          <div>
            <h5 className="text-md font-semibold text-white tracking-wider uppercase">Contact Us</h5>
            <address className="mt-4 space-y-3 text-sm not-italic">
              <p className="flex items-start">
                <FiMapPin className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0 text-sky-400" />
                <span>myweb</span>
              </p>
              <p className="flex items-center">
                <FiPhone className="h-5 w-5 mr-3 flex-shrink-0 text-sky-400" />
                <span>myweb</span>
              </p>
              <p className="flex items-center">
                <FiMail className="h-5 w-5 mr-3 flex-shrink-0 text-sky-400" />
                <a href="mailto:crms6@tesaban6.ac.th" className="hover:text-sky-400 transition-colors">
                  myweb
                </a>
              </p>
            </address>
          </div>

          <div>
            <h5 className="text-md font-semibold text-white tracking-wider uppercase">Links</h5>
            <div className="mt-4 space-y-3 text-sm">
               <p className="flex items-center">
                <FiGlobe className="h-5 w-5 mr-3 flex-shrink-0 text-sky-400" />
                <a 
                  href="https://myweb.ac.th/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-sky-400 transition-colors"
                >
                  Project Website
                </a>
              </p>
            </div>
          </div>

        </div>

        <div className="mt-12 border-t border-gray-700 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Smart Flood Project. All rights reserved.</p>
        </div>

        <VisitorCounters/>
      </div>
    </footer>
  );
};

export default Footer;