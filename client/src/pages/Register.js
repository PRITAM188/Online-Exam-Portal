import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

const API_URL = 'http://127.0.0.1:3001/api';

function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        enrollmentNumber: '',
        department: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            setLoading(false);
            return;
        }

        try {
            await axios.post(`${API_URL}/auth/register`, formData);
            toast.success('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-800">Create a new account</h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <input name="name" placeholder="Full Name" onChange={handleChange} required className="appearance-none rounded-none relative block w-full px-3 py-2.5 border border-gray-300 bg-white text-gray-800 placeholder-gray-500 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" />
                        <input name="email" type="email" placeholder="Email Address" onChange={handleChange} required className="appearance-none rounded-none relative block w-full px-3 py-2.5 border border-gray-300 bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" />
                        <input name="password" type="password" placeholder="Password" onChange={handleChange} required className="appearance-none rounded-none relative block w-full px-3 py-2.5 border border-gray-300 bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" />
                        <input name="enrollmentNumber" placeholder="Enrollment Number" onChange={handleChange} required className="appearance-none rounded-none relative block w-full px-3 py-2.5 border border-gray-300 bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" />
                        <input name="department" placeholder="Department" onChange={handleChange} required className="appearance-none rounded-none relative block w-full px-3 py-2.5 border border-gray-300 bg-white text-gray-800 placeholder-gray-500 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" />
                    </div>

                    <div>
                        <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed">
                            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                ✨
                            </span>
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </div>
                </form>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;