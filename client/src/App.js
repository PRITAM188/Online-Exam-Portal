import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import ExamManager from './pages/admin/ExamManager';
import CreateExam from './pages/admin/CreateExam';
import ResultsManager from './pages/admin/ResultsManager';
import StudentDashboard from './pages/student/StudentDashboard';
import ExamInstructions from './pages/student/ExamInstructions';
import ExamTaker from './pages/student/ExamTaker';
import MyResults from './pages/student/MyResults';
import NotFound from './pages/NotFound';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
    const { user } = useAuth();
    return user && user.role === 'admin' ? children : <Navigate to="/login" />;
};

const StudentRoute = ({ children }) => {
    const { user } = useAuth();
    return user && user.role === 'student' ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Profile Route */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/exams" element={<AdminRoute><ExamManager /></AdminRoute>} />
          <Route path="/admin/exams/create" element={<AdminRoute><CreateExam /></AdminRoute>} />
          <Route path="/admin/results" element={<AdminRoute><ResultsManager /></AdminRoute>} />

          {/* Student Routes */}
          <Route path="/student/dashboard" element={<StudentRoute><StudentDashboard /></StudentRoute>} />
          <Route path="/student/exam/instructions/:id" element={<StudentRoute><ExamInstructions /></StudentRoute>} />
          <Route path="/student/exam/take/:id" element={<StudentRoute><ExamTaker /></StudentRoute>} />
          <Route path="/student/results" element={<StudentRoute><MyResults /></StudentRoute>} />
          
          {/* Not Found Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}

export default App;