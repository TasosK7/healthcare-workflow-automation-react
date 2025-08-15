import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {useState, useEffect} from "react";
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Departments from './pages/Departments';
import Staff from './pages/Staff';
import Patient from './pages/Patient';
import Register from './pages/Register';
import ProtectedRoute from "./components/ProtectedRoute.tsx";

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));

    useEffect(() => {
        const handleStorageChange = () => {
            setIsLoggedIn(!!localStorage.getItem('authToken'));
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />

                <Route
                    path="/register"
                    element={
                        isLoggedIn ? (
                            <Navigate to="/dashboard" />
                        ) : (
                            <Register />
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
