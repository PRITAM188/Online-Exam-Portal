import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-4rem)]">
            <span role="img" aria-label="warning" className="text-6xl">⚠️</span>
            <h1 className="mt-6 text-4xl md:text-5xl font-extrabold text-gray-800">404 - Page Not Found</h1>
            <p className="mt-4 max-w-xl text-lg text-gray-600">
                Sorry, the page you are looking for does not exist. It might have been moved or deleted.
            </p>
            <div className="mt-8">
                <Link to="/" className="px-6 py-2.5 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-3 md:text-lg md:px-8">
                    Go Back Home
                </Link>
            </div>
        </div>
    );
}

export default NotFound;