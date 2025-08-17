import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { Toaster, toast } from 'react-hot-toast';

const API_URL = 'http://127.0.0.1:3001/api';

function AdminDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/admin/dashboard`);
                setData(response.data);
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to fetch dashboard data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const StatCard = ({ icon, title, value, color }) => (
        <div className="bg-white p-5 rounded-lg flex items-center space-x-4 shadow">
            <div className={`p-2.5 rounded-full text-xl ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-600">{title}</p>
                <p className="text-xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    );

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-10 min-h-[440px]">
            <Toaster position="top-center" reverseOrder={false} />
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard icon="👥" title="Total Users" value={data.stats.users} color="bg-blue-500 text-blue-600" />
                <StatCard icon="📚" title="Total Exams" value={data.stats.exams} color="bg-green-500 text-green-600" />
                <StatCard icon="✅" title="Total Submissions" value={data.stats.submissions} color="bg-purple-500 text-purple-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-3 text-gray-800">Recent Exams</h2>
                    <ul className="space-y-2">
                        {data.recentExams.map(exam => (
                            <li key={exam._id} className="bg-gray-50 p-3 rounded-md flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-gray-800">{exam.title}</p>
                                    <p className="text-xs text-gray-600">Created by {exam.createdBy.name}</p>
                                </div>
                                <span className="text-sm text-gray-600">{new Date(exam.createdAt).toLocaleDateString()}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-white p-5 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-3 text-gray-800">Recent Submissions</h2>
                    <ul className="space-y-2">
                        {data.recentSubmissions.map(sub => (
                            <li key={sub._id} className="bg-gray-50 p-3 rounded-md flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-gray-800">{sub.examId.title}</p>
                                    <p className="text-xs text-gray-600">By {sub.studentId.name}</p>
                                </div>
                                <span className="text-sm text-gray-600">{new Date(sub.submittedAt).toLocaleDateString()}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;