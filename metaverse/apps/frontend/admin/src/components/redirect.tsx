import { Navigate } from 'react-router-dom';

export function Redirect() {
    const token = localStorage.getItem("token");
    return token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
}