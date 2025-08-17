import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { Toaster, toast } from 'react-hot-toast';

const API_URL = 'http://127.0.0.1:3001/api';

function Profile() {
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
        if (passwordData.newPassword.length < 8) {
            toast.error('New password must be at least 8 characters long.');
            return;
        }
        try {
            const response = await axios.patch(`${API_URL}/users/me/change-password`, passwordData);
            toast.success(response.data.message);
            setPasswordData({ currentPassword: '', newPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to change password.');
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
                
                {user && (
                    <div className="bg-white p-6 rounded-lg shadow">
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
                            <div><strong>Role:</strong> <span className="capitalize">{user.role}</span></div>
                        </div>
                    </div>
                )}

                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Change Password</h2>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <input 
                            type="password" 
                            name="currentPassword"
                            placeholder="Current Password" 
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            required
                            className="w-full px-3 py-2.5 border border-gray-300 bg-white text-gray-800 rounded-md focus:outline-none focus:ring-indigo-500"
                        />
                        <input 
                            type="password" 
                            name="newPassword"
                            placeholder="New Password" 
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            required
                            className="w-full px-3 py-2.5 border border-gray-300 bg-white text-gray-800 rounded-md focus:outline-none focus:ring-indigo-500"
                        />
                        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700">
                            Update Password
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Profile;