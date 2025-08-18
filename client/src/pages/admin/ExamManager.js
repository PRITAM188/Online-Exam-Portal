import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import Modal from '../../components/shared/Modal';
import { Toaster, toast } from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL;

function ExamManager() {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, onConfirm: null, title: '', message: '' });

    const fetchExams = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/exams`);
            setExams(response.data);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to fetch exams.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchExams();
    }, [fetchExams]);

    const handleTogglePublish = async (examId, isPublished) => {
        const action = isPublished ? 'unpublish' : 'publish';
        try {
            await axios.patch(`${API_URL}/exams/${examId}/${action}`);
            fetchExams();
        } catch (err) {
            toast.error(`Failed to ${action} exam.`);
        }
    };
    
    const handleDelete = (examId) => {
        setConfirmModal({
            isOpen: true,
            title: "Confirm Deletion",
            message: "Are you sure you want to delete this exam? This will also delete all student submissions and results for this exam. This action cannot be undone.",
            onConfirm: async () => {
                try {
                    await axios.delete(`${API_URL}/exams/${examId}`);
                    fetchExams();
                    setConfirmModal({ isOpen: false });
                } catch (err) {
                    toast.error('Failed to delete exam.');
                    setConfirmModal({ isOpen: false });
                }
            }
        });
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-8 min-h-[440px]">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Exam Manager</h1>
                <Link to="/admin/exams/create" className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-1.5 px-3 rounded-md">
                    <span className="mr-1 text-lg">+</span> Create New Exam
                </Link>
            </div>

            {exams.length === 0 ? (
                <div className="bg-white shadow rounded-lg p-8 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No exams found</h3>
                    <p className="mt-1 text-gray-500">Get started by creating a new exam.</p>
                    <div className="mt-6">
                        <Link to="/admin/exams/create" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Create Exam
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Title</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Subject</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Questions</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                                    <th className=""></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {exams.map((exam) => (
                                    <tr key={exam._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">{exam.title}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{exam.subject}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{exam.questions.length}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${exam.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {exam.isPublished ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-4 flex items-center">
                                            <button onClick={() => handleTogglePublish(exam._id, exam.isPublished)} className={`flex items-center ${exam.isPublished ? 'text-yellow-600 hover:text-yellow-500' : 'text-indigo-600 hover:text-indigo-500'}`}>
                                                {exam.isPublished ? 'Unpublish' : 'Publish'}
                                            </button>
                                        </td>
                                        <td>
                                            <button onClick={() => handleDelete(exam._id)} className="font-bold text-red-700 hover:text-red-400">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            <Modal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false })}
                title={confirmModal.title}
            >
                <p className="text-gray-600 mb-4">{confirmModal.message}</p>
                <div className="flex justify-end space-x-3">
                    <button onClick={() => setConfirmModal({ isOpen: false })} className="px-3 py-1.5 rounded-md bg-gray-200 hover:bg-gray-300">Cancel</button>
                    <button onClick={confirmModal.onConfirm} className="px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white">Confirm</button>
                </div>
            </Modal>
        </div>
    );
}

export default ExamManager;

