import React from 'react';
import Header from './Header';
import Footer from './Footer';

function Layout({ children }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-400 via-gray-200 to-gray-400 text-gray-800 font-sans">
            <Header />
            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                {children}
            </main>
            <Footer />
        </div>
    );
}

export default Layout;