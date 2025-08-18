import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="flex flex-col items-center justify-center text-center min-h-[440px]">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight">
                Welcome to the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Online Exam Portal</span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-gray-600">
                Your gateway to seamless online examinations. Please log in or register to access your dashboard and begin your assessments.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link to="/login" className="flex items-center justify-center px-6 py-2.5 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-3 md:text-lg md:px-8 transition-colors transform hover:scale-105">
                    Login Now <span className="ml-2">→</span>
                </Link>
                <Link to="/register" className="flex items-center justify-center px-6 py-2.5 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-3 md:text-lg md:px-8 transition-colors transform hover:scale-105">
                    Register
                </Link>
            </div>
        </div>
    );
}

export default Home;