import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { Toaster, toast } from 'react-hot-toast';

const API_URL = 'http://127.0.0.1:3001/api';

function MyResults() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await axios.get(`${API_URL}/submissions/me/results`);
                setResults(response.data);
            } catch (err) {
                toast.error(err.response?.data?.message || 'Could not fetch your results.');
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, []);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-4 min-h-[440px]">
            <Toaster position="top-center" reverseOrder={false} />
            <h1 className="text-2xl font-bold text-gray-800">My Results</h1>
            {results.length > 0 ? (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Exam Title</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Date Published</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Score</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Grade</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {results.map((result) => (
                                    <tr key={result._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">{result.examId.title}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{new Date(result.publishedAt).toLocaleDateString()}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{result.score} / {result.totalMarks}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-indigo-600">{result.grade}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <span role="img" aria-label="award" className="text-5xl">🏆</span>
                    <h2 className="mt-3 text-xl font-semibold text-gray-800">No Results Available</h2>
                    <p className="text-gray-500 mt-1">Your results will appear here once they have been published by an administrator.</p>
                </div>
            )}
        </div>
    );
}

export default MyResults;