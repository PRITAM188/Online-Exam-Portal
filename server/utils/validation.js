module.exports = {
    validateEmail: (email) => {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
    },
    validatePassword: (password) => {
        return password.length >= 8;
    },
    validateExam: (exam) => {
        // Basic validation
        if (!exam.title || exam.title.length < 5) return false;
        if (!exam.questions || exam.questions.length === 0) return false;
        
        // Validate each question
        for (const question of exam.questions) {
            if (!question.question || question.question.length < 5) return false;
            if (!question.correctAnswer) return false;
            if (question.type === 'mcq' && (!question.options || question.options.length < 2)) return false;
        }
        
        // Validate time limit (minimum 1 minute)
        if (exam.timeLimit && exam.timeLimit < 1) return false;
        
        return true;
    }
};