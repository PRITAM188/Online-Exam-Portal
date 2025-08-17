import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { Toaster, toast } from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:3001/api';
const inputClasses = "w-full px-3 py-2.5 border border-gray-300 bg-white text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500";

function Profile() {
    // ... (state and useEffect code remains the same)
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${API_URL}/users/me`);
                setUser(response.data);
            } catch (error) {
                toast.error('Could not fetch profile data.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);
    
    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };


    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        // Client-side checks
        if (passwordData.currentPassword === passwordData.newPassword) {
            toast.error('New password cannot be the same as the current password.');
            return;
        }
        if (passwordData.newPassword.length < 8) {
            toast.error('New password must be at least 8 characters long.');
            return;
        }

        try {
            // --- STEP 1: Send data to the backend ---
            const response = await axios.patch(`${API_URL}/users/me/change-password`, passwordData);

            // --- STEP 2 (SUCCESS): If backend responds with success, this code runs ---
            // It shows the success message from the server.
            toast.success(response.data.message || 'Password updated successfully!');
            
            setPasswordData({ currentPassword: '', newPassword: '' });

        } catch (error) {
            // --- STEP 2 (FAILURE): If backend responds with an error (like wrong password), this code runs ---
            // It shows the specific error message from the server.
            toast.error(error.response?.data?.message || 'Failed to change password.');
        }
    };

    // ... (JSX rendering code remains the same)
    if (loading) return <LoadingSpinner />;

    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
                {/* Profile Details and Change Password Form */}
                <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
                
                {user && (
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">Profile Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                            <div><strong>Name:</strong> {user.name}</div>
                            <div><strong>Email:</strong> {user.email}</div>
                            {user.role === 'student' && (
                                <>
                                    <div><strong>Enrollment No:</strong> {user.enrollmentNumber}</div>
                                    <div><strong>Department:</strong> {user.department}</div>
                                </>
                            )}
                            <div><strong>Role:</strong> <span className="capitalize bg-indigo-100 text-indigo-800 text-sm font-medium px-2.5 py-0.5 rounded-full">{user.role}</span></div>
                        </div>
                    </div>
                )}

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Change Password</h2>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Current Password
                            </label>
                            <input 
                                type="password" 
                                id="currentPassword"
                                name="currentPassword"
                                placeholder="Enter your current password" 
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                required
                                className={inputClasses}
                            />
                        </div>
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                New Password
                            </label>
                            <input 
                                type="password" 
                                id="newPassword"
                                name="newPassword"
                                placeholder="Enter your new password (min. 8 characters)" 
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                required
                                className={inputClasses}
                            />
                        </div>
                        <button type="submit" className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ease-in-out duration-150">
                            Update Password
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Profile;