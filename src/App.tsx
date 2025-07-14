import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Departments from './pages/Departments';
import Staff from './pages/Staff';
import Patient from './pages/Patient';
import ProtectedRoute from "./components/ProtectedRoute.tsx";

const App = () => {
    const isLoggedIn = !!localStorage.getItem('authToken');

    return (
        <Router>
            <Routes>
                <Route
                    path="/login"
                    element={
                        isLoggedIn ? (
                            <Navigate to="/dashboard" />
                        ) : (
                            <Login />
                        )
                    }
                />
                
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['admin', 'hr']}>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/departments"
                    element={
                        <ProtectedRoute allowedRoles={['admin', 'hr']}>
                            <Departments />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/staff"
                    element={
                        <ProtectedRoute allowedRoles={['staff']}>
                            <Staff />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/patient"
                    element={
                        <ProtectedRoute allowedRoles={['patient']}>
                            <Patient />
                        </ProtectedRoute>
                    }
                />


                {/* fallback route */}
                <Route path="*" element={<Navigate to={isLoggedIn ? '/dashboard' : '/login'} />} />
            </Routes>
        </Router>
    );
};

export default App;
