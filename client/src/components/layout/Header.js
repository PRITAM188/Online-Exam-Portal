import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinkClasses = "flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200";
    const activeNavLinkClasses = "bg-indigo-100 text-indigo-600";

    return (
        <header className="bg-gray-100 shadow-sm sticky top-0 z-50 border-b border-gray-200">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to={user ? (user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard') : '/'} className="flex-shrink-0 flex items-center space-x-2 hover:scale-105 transition-transform">
                            <span role="img" aria-label="logo" className="text-2xl bg-gradient-to-r from-indigo-800 to-purple-500 bg-clip-text text-transparent">🎓</span>
                            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Online Exam Portal</span>
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-6 flex items-baseline space-x-1">
                            {user ? (
                                user.role === 'admin' ? (
                                    <>
                                        <NavLink to="/admin/dashboard" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}><span className="mr-1">📊</span>Dashboard</NavLink>
                                        <NavLink to="/admin/exams" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}><span className="mr-1">📝</span>Exams</NavLink>
                                        <NavLink to="/admin/results" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}><span className="mr-1">📄</span>Results</NavLink>
                                    </>
                                ) : (
                                    <>
                                        <NavLink to="/student/dashboard" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}><span className="mr-1">📊</span>Dashboard</NavLink>
                                        <NavLink to="/student/results" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}><span className="mr-1">📄</span>My Results</NavLink>
                                    </>
                                )
                            ) : (
                                <>
                                    <NavLink to="/" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Home</NavLink>
                                    <NavLink to="/login" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Login</NavLink>
                                    <NavLink to="/register" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>Register</NavLink>
                                </>
                            )}
                        </div>
                    </div>
                    {user && (
                        <div className="hidden md:flex items-center space-x-3">
                            <NavLink to="/profile" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''} bg-gray-200 px-3 py-1 rounded-full`}>
                                <span className="text-gray-700 flex items-center bg-gray-200 px-3 py-1 rounded-full text-sm"><span className="mr-1">👤</span> {user.name}</span>
                            </NavLink>
                            <button onClick={handleLogout} className="flex items-center bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium py-1.5 px-4 rounded-full transition-all duration-200 shadow-sm hover:shadow-md">
                                <span className="mr-1">↪</span> Logout
                            </button>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
}

export default Header;