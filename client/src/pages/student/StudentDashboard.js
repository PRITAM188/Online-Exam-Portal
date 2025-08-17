import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { Toaster, toast } from 'react-hot-toast';

const API_URL = 'http://127.0.0.1:3001/api';

function StudentDashboard() {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await axios.get(`${API_URL}/exams`);
                setExams(response.data);
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to fetch available exams.');
            } finally {
                setLoading(false);
            }
        };
        fetchExams();
    }, []);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6 min-h-[440px]">
            <Toaster position="top-center" reverseOrder={false} />
            <h1 className="text-2xl font-bold text-gray-800">Available Exams</h1>
            {exams.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {exams.map(exam => (
                        <div key={exam._id} className="bg-white p-5 rounded-lg shadow flex flex-col justify-between hover:shadow-md transition-all duration-300">
                            <div>
                                <h2 className="text-lg font-bold text-gray-800 mb-1">{exam.title}</h2>
                                <p className="text-sm text-gray-500 mb-3">{exam.subject}</p>
                                <div className="flex items-center text-gray-500 text-xs mb-1">
                                    <span className="mr-1">❓</span> {exam.questions.length} Questions
                                </div>
                                <div className="flex items-center text-gray-500 text-xs mb-1">
                                    <span className="mr-1">🕒</span> {exam.timeLimit} Minutes
                                </div>
                                <div className="flex items-center text-gray-500 text-xs mb-3">
                                    <span className="mr-1">🔁</span> {exam.maxAttempts} Attempt(s) allowed
                                </div>
                            </div>
                            <Link to={`/student/exam/instructions/${exam._id}`} className="w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-1.5 px-3 rounded-md transition-colors text-sm">
                                Start Exam
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <h2 className="text-xl font-semibold text-gray-800">No Exams Available</h2>
                    <p className="text-gray-500 mt-1">Please check back later for new exams.</p>
                </div>
            )}
        </div>
    );
}

export default StudentDashboard;