import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL;

function CreateExam() {
    const [examData, setExamData] = useState({
        title: '',
        subject: '',
        description: '',
        timeLimit: 60,
        maxAttempts: 1,
        questions: [{ question: '', type: 'mcq', options: ['', '', '', ''], correctAnswer: '', marks: 1 }]
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleExamChange = (e) => {
        setExamData({ ...examData, [e.target.name]: e.target.value });
    };
    const handleQuestionChange = (index, e) => {
        const updatedQuestions = [...examData.questions];
        updatedQuestions[index][e.target.name] = e.target.value;
        setExamData({ ...examData, questions: updatedQuestions });
    };
    const handleOptionChange = (qIndex, oIndex, e) => {
        const updatedQuestions = [...examData.questions];
        updatedQuestions[qIndex].options[oIndex] = e.target.value;
        setExamData({ ...examData, questions: updatedQuestions });
    };
    const addQuestion = () => {
        setExamData({
            ...examData,
            questions: [...examData.questions, { question: '', type: 'mcq', options: ['', '', '', ''], correctAnswer: '', marks: 1 }]
        });
    };
    const removeQuestion = (index) => {
        const updatedQuestions = examData.questions.filter((_, i) => i !== index);
        setExamData({ ...examData, questions: updatedQuestions });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        for (const [index, question] of examData.questions.entries()) {
            if (question.type === 'mcq' && !question.options.includes(question.correctAnswer)) {
                toast.error(`Error in Question ${index + 1}: The correct answer must exactly match one of the provided options.`);
                return;
            }
            const hasDuplicates = new Set(question.options).size !== question.options.length;
            if (question.type === 'mcq' && hasDuplicates) {
                toast.error(`Error in Question ${index + 1}: Options must be unique.`);
                return;
            }
        }
        
        setLoading(true);

        try {
            await axios.post(`${API_URL}/exams`, examData);
            toast.success('Exam created successfully!');
            navigate('/admin/exams');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create exam.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow max-w-4xl mx-auto">
            <Toaster position="top-center" reverseOrder={false} />
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Create New Exam</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="bg-gray-50 p-5 rounded-lg space-y-3 border border-gray-200">
                    <h2 className="text-lg font-semibold text-indigo-600">Exam Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="title" placeholder="Exam Title" onChange={handleExamChange} className="bg-white border border-gray-300 rounded-md p-2.5 text-gray-800 focus:ring-indigo-500 focus:border-indigo-500" required />
                        <input name="subject" placeholder="Subject" onChange={handleExamChange} className="bg-white border border-gray-300 rounded-md p-2.5 text-gray-800 focus:ring-indigo-500 focus:border-indigo-500" required />
                    </div>
                    <textarea name="description" placeholder="Description" onChange={handleExamChange} className="bg-white border border-gray-300 rounded-md p-2.5 w-full text-gray-800 focus:ring-indigo-500 focus:border-indigo-500" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="number" name="timeLimit" placeholder="Time Limit (minutes)" onChange={handleExamChange} value={examData.timeLimit} className="bg-white border border-gray-300 rounded-md p-2.5 text-gray-800 focus:ring-indigo-500 focus:border-indigo-500" required min="1" />
                        <input type="number" name="maxAttempts" placeholder="Max Attempts" onChange={handleExamChange} value={examData.maxAttempts} className="bg-white border border-gray-300 rounded-md p-2.5 text-gray-800 focus:ring-indigo-500 focus:border-indigo-500" required min="1" />
                    </div>
                </div>

                <h2 className="text-xl font-semibold mt-6 mb-2 text-gray-800 border-t border-gray-200 pt-4">Questions</h2>
                {examData.questions.map((q, qIndex) => (
                    <div key={qIndex} className="bg-gray-50 p-5 rounded-lg space-y-3 border border-gray-200">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-indigo-600">Question {qIndex + 1}</h3>
                            <button type="button" onClick={() => removeQuestion(qIndex)} className="text-red-500 hover:text-red-400 p-1 rounded-full hover:bg-red-100 text-xl">🗑️</button>
                        </div>
                        <textarea name="question" placeholder="Question text" value={q.question} onChange={(e) => handleQuestionChange(qIndex, e)} className="bg-white border border-gray-300 rounded-md p-2.5 w-full text-gray-800" required />
                        {q.options.map((opt, oIndex) => (
                            <input key={oIndex} type="text" placeholder={`Option ${oIndex + 1}`} value={opt} onChange={(e) => handleOptionChange(qIndex, oIndex, e)} className="bg-white border border-gray-300 rounded-md p-2.5 w-full text-gray-800" required />
                        ))}
                        <input name="correctAnswer" placeholder="Correct Answer (must match one option exactly)" value={q.correctAnswer} onChange={(e) => handleQuestionChange(qIndex, e)} className="bg-white border border-gray-300 rounded-md p-2.5 w-full text-gray-800" required />
                        <input type="number" name="marks" placeholder="Marks" value={q.marks} onChange={(e) => handleQuestionChange(qIndex, e)} className="bg-white border border-gray-300 rounded-md p-2.5 text-gray-800" required min="1" />
                    </div>
                ))}
                <button type="button" onClick={addQuestion} className="flex items-center justify-center w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:bg-gray-100 hover:border-gray-400 transition-colors">
                    <span className="mr-2 text-lg">+</span> Add Question
                </button>
                
                <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-md disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors">
                    {loading ? 'Creating...' : 'Create Exam'}
                </button>
            </form>
        </div>
    );
}

export default CreateExam;