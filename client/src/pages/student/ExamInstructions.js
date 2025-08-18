import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { Toaster, toast } from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL;

function ExamInstructions() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    const [attempts, setAttempts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchExamData = async () => {
            try {
                const [examRes, attemptsRes] = await Promise.all([
                    axios.get(`${API_URL}/exams/${id}`),
                    axios.get(`${API_URL}/exams/${id}/attempts`)
                ]);
                setExam(examRes.data);
                setAttempts(attemptsRes.data);
            } catch (err) {
                toast.error(err.response?.data?.message || 'Could not load exam details.');
                setError();
            } finally {
                setLoading(false);
            }
        };
        fetchExamData();
    }, [id]);

    if (loading) return <LoadingSpinner />;
    
    if (error || (attempts && !attempts.allowed)) {
        return (
            <div className="text-center py-12 bg-white rounded-lg shadow">
                <Toaster position="top-center" reverseOrder={false} />
                <span role="img" aria-label="error" className="text-5xl">🚫</span>
                <h2 className="mt-3 text-xl font-semibold text-gray-800">Access Denied</h2>
                <p className="text-gray-500 mt-1">{error || `You have reached the maximum number of attempts (${attempts?.maxAttempts}) for this exam.`}</p>
                <Link to="/student/dashboard" className="mt-4 inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-1.5 px-4 rounded-md text-sm">
                    Back to Dashboard
                </Link>
            </div>
        );
    }
    
    if (!exam || !attempts) {
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
            <Toaster position="top-center" reverseOrder={false} />
            <h1 className="text-2xl font-bold text-gray-800 mb-3">{exam.title} - Instructions</h1>
            <p className="text-gray-600 mb-5">{exam.description}</p>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 flex items-center"><span className="text-green-500 mr-1">📋</span>Exam Details</h3>
                    <ul className="list-disc list-inside text-gray-600 mt-1 space-y-1 text-sm">
                        <li>Subject: {exam.subject}</li>
                        <li>Total Questions: {exam.questions.length}</li>
                        <li>Time Limit: {exam.timeLimit} minutes</li>
                        <li>Attempts Remaining: {exam.maxAttempts - attempts.attempts} / {exam.maxAttempts}</li>
                    </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 flex items-center"><span className="text-yellow-500 mr-1">🛡️</span>Important Rules</h3>
                    <ul className="list-disc list-inside text-gray-600 mt-1 space-y-1 text-sm">
                        <li>Do not close the exam window or tab.</li>
                        <li>Switching tabs is prohibited and will be flagged.</li>
                        <li>Ensure you have a stable internet connection.</li>
                        <li>The timer will not stop once started.</li>
                    </ul>
                </div>
            </div>

            <div className="text-center">
                <button onClick={() => navigate(`/student/exam/take/${id}`)} className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-8 rounded-md transition-colors">
                    I Understand, Start Exam
                </button>
            </div>
        </div>
    );
}

export default ExamInstructions;