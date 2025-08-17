import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTabFocus } from '../../hooks/useTabFocus';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import Modal from '../../components/shared/Modal';
import { Toaster, toast } from 'react-hot-toast';

const API_URL = 'http://127.0.0.1:3001/api';

function ExamTaker() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    const [answers, setAnswers] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isWarningModalOpen, setWarningModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmitExam = useCallback(async () => {
        setIsSubmitting(true);
        const formattedAnswers = Object.keys(answers).map(questionId => ({
            questionId,
            selectedOption: answers[questionId]
        }));
        try {
            await axios.post(`${API_URL}/submissions`, {
                examId: id,
                answers: formattedAnswers,
                timeTaken: exam.timeLimit * 60 - timeLeft,
            });
            navigate('/student/results');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to submit exam.');
            setIsSubmitting(false);
        }
    }, [answers, id, exam, timeLeft, navigate]);

    useTabFocus(useCallback(() => {
        setWarningModalOpen(true);
    }, []));

    useEffect(() => {
        const fetchExam = async () => {
            try {
                const response = await axios.get(`${API_URL}/exams/${id}`);
                setExam(response.data);
                setTimeLeft(response.data.timeLimit * 60);
            } catch (err) {
                toast.error(err.response?.data?.message || 'Could not load the exam.');
            } finally {
                setLoading(false);
            }
        };
        fetchExam();
    }, [id]);

    useEffect(() => {
        if (timeLeft > 0 && !isSubmitting) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (exam && !isSubmitting) {
            handleSubmitExam();
        }
    }, [timeLeft, exam, handleSubmitExam, isSubmitting]);

    const handleAnswerChange = (questionId, selectedOption) => {
        setAnswers({ ...answers, [questionId]: selectedOption });
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) return <LoadingSpinner />;
    if (!exam) return null;

    const currentQuestion = exam.questions[currentQuestionIndex];

    return (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow min-h-[440px]">
            <Toaster position="top-center" reverseOrder={false} />
            <Modal isOpen={isWarningModalOpen} title="Warning" onClose={() => setWarningModalOpen(false)}>
                <div className="text-center">
                    <span role="img" aria-label="warning" className="text-5xl">⚠️</span>
                    <p className="text-gray-800 mt-3">Please do not switch tabs or windows during the exam.</p>
                    <p className="text-gray-600 mt-1">This action is logged and may lead to disqualification.</p>
                    <button onClick={() => setWarningModalOpen(false)} className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-1.5 px-4 rounded-md">I Understand</button>
                </div>
            </Modal>
            
            <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-3">
                <h1 className="text-xl font-bold text-gray-800">{exam.title}</h1>
                <div className="flex items-center bg-red-100 text-red-700 font-medium py-1 px-3 rounded-md text-sm">
                    <span className="mr-1">🕒</span> Time Left: {formatTime(timeLeft)}
                </div>
            </div>

            <div>
                <p className="text-gray-600 mb-1 text-sm">Question {currentQuestionIndex + 1} of {exam.questions.length}</p>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">{currentQuestion.question}</h2>
                <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                        <label key={index} className={`block p-3 rounded-md border cursor-pointer transition-all ${answers[currentQuestion._id] === option ? 'bg-indigo-100 border-indigo-500' : 'bg-white border-gray-300 hover:border-gray-400'}`}>
                            <input
                                type="radio"
                                name={currentQuestion._id}
                                value={option}
                                checked={answers[currentQuestion._id] === option}
                                onChange={() => handleAnswerChange(currentQuestion._id, option)}
                                className="hidden"
                            />
                            <span className="text-gray-800">{option}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                <button 
                    onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)} 
                    disabled={currentQuestionIndex === 0}
                    className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-1.5 px-3 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span className="mr-1">←</span> Previous
                </button>
                {currentQuestionIndex < exam.questions.length - 1 ? (
                    <button 
                        onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                        className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-1.5 px-3 rounded-md"
                    >
                        Next <span className="ml-1">→</span>
                    </button>
                ) : (
                    <button 
                        onClick={handleSubmitExam}
                        disabled={isSubmitting}
                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-1.5 px-3 rounded-md disabled:bg-green-400"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Exam'}
                    </button>
                )}
            </div>
        </div>
    );
}

export default ExamTaker;