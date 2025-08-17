import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import Modal from '../../components/shared/Modal';
import { Toaster, toast } from 'react-hot-toast';

const API_URL = 'http://127.0.0.1:3001/api';

function ResultsManager() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewingExam, setViewingExam] = useState(null);
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        onConfirm: null,
        title: '',
        message: ''
    });

    const fetchResults = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/admin/results`);
            setResults(response.data);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch results.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchResults();
    }, [fetchResults]);

    const groupedResults = useMemo(() => {
        return results.reduce((acc, result) => {
            const exam = result.examId;
            if (!acc[exam._id]) {
                acc[exam._id] = {
                    examId: exam._id,
                    examTitle: exam.title,
                    results: [],
                };
            }
            acc[exam._id].results.push(result);
            return acc;
        }, {});
    }, [results]);
    
    const handleBulkTogglePublish = async (exam) => {
        const isAnyUnpublished = exam.results.some(r => !r.isPublished);
        const action = isAnyUnpublished ? 'publish' : 'unpublish';
        setLoading(true);
        try {
            const requests = exam.results.map(result =>
                axios.patch(`${API_URL}/admin/results/${result._id}/${action}`)
            );
            await Promise.all(requests);
            fetchResults();
            toast.success(`Results for ${exam.title} have been ${action}ed`);
        } catch (err) {
            toast.error(`Failed to ${action} all results.`);
            setLoading(false);
        }
    };

    const handleDeleteAll = (exam) => {
        setConfirmModal({
            isOpen: true,
            title: `Confirm Deletion: ${exam.examTitle}`,
            message: `Are you sure you want to delete all ${exam.results.length} results for this exam? This action cannot be undone.`,
            onConfirm: async () => {
                setLoading(true);
                try {
                    const requests = exam.results.map(result => 
                        axios.delete(`${API_URL}/admin/results/${result._id}`)
                    );
                    await Promise.all(requests);
                    setConfirmModal({ isOpen: false });
                    fetchResults();
                    toast.success('All results deleted successfully.');
                } catch (err) {
                    toast.error('Failed to delete all results.');
                    setLoading(false);
                }
            }
        });
    };

    if (loading) return <LoadingSpinner />;
    
    const exams = Object.values(groupedResults);

    return (
        <div className="space-y-8 min-h-[440px]">
            <Toaster position="top-center" reverseOrder={false} />
            <h1 className="text-2xl font-bold text-gray-800">Results Manager</h1>

            {exams.length === 0 ? (
                <div className="bg-white shadow rounded-lg p-8 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No results found</h3>
                    <p className="mt-1 text-gray-500">There are currently no exam results available.</p>
                </div>
            ) : (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Exam Title</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Total Results</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"></th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {exams.map((exam) => {
                                    const allPublished = exam.results.every(r => r.isPublished);
                                    return (
                                        <tr key={exam.examId} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium text-gray-800">{exam.examTitle}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{exam.results.length}</td>
                                            <td className="px-4 py-3">
                                                {allPublished ? (
                                                    <span className="flex items-center text-green-600"><span className="mr-1">✓</span> Published</span>
                                                ) : (
                                                    <span className="flex items-center text-yellow-600"><span className="mr-1">✗</span> Not Published</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-4">
                                                <button onClick={() => setViewingExam(exam)} className="text-blue-600 hover:text-blue-500">View Results</button>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-4">
                                                <button onClick={() => handleBulkTogglePublish(exam)} className={`${allPublished ? 'text-yellow-600 hover:text-yellow-500' : 'text-indigo-600 hover:text-indigo-500'}`}>{allPublished ? "Unpublish All" : "Publish All"}</button>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-4">
                                                <button onClick={() => handleDeleteAll(exam)} className="text-red-600 hover:text-red-500">Delete All</button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            {viewingExam && (
                <Modal isOpen={!!viewingExam} onClose={() => setViewingExam(null)} title={`Results for: ${viewingExam.examTitle}`}>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Student</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Score</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Percentage</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Grade</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-400">
                                {viewingExam.results.map(result => (
                                    <tr key={result._id}>
                                        <td className="px-4 py-3">
                                            <div className="text-sm font-medium text-gray-800">{result.studentId.name}</div>
                                            <div className="text-sm text-gray-500">{result.studentId.email}</div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{result.score} / {result.totalMarks}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{result.percentage.toFixed(2)}%</td>
                                        <td className="px-4 py-3 text-sm font-bold text-indigo-600">{result.grade}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-end mt-4">
                        <button onClick={() => setViewingExam(null)} className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-700 text-white">Close</button>
                    </div>
                </Modal>
            )}

            <Modal isOpen={confirmModal.isOpen} onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })} title={confirmModal.title}>
                <p className="text-gray-600 mb-4">{confirmModal.message}</p>
                <div className="flex justify-end space-x-3">
                    <button onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })} className="px-3 py-1.5 rounded-md bg-gray-200 hover:bg-gray-300">Cancel</button>
                    <button onClick={confirmModal.onConfirm} className="px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white">Confirm Delete</button>
                </div>
            </Modal>
        </div>
    );
}

export default ResultsManager;