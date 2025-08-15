import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" state={{from: location}} replace />;
    }

    if (!allowedRoles.includes(role || '')) {
        return <div className="p-6 text-red-600 font-semibold">403 – Access Denied</div>;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
