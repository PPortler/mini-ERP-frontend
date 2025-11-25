import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";

type ProtectedRouteProps = {
    children: ReactNode;
    allowedRoles?: number[];
    redirectTo?: string;
    blockIfAuth?: boolean;
};

export default function ProtectedRoute({
    children,
    allowedRoles,
    redirectTo = "/",
    blockIfAuth = false,
}: ProtectedRouteProps) {
    const { accessToken, user } = AuthProvider.useAuth();

    if (blockIfAuth && accessToken && user?.role) {
        return <Navigate to="/dashboard" replace />;
    }

    // ถ้า allowedRoles กำหนดและ role ไม่มีสิทธิ์
    if (allowedRoles && (!user?.role || !allowedRoles.includes(user?.role))) {
        return <Navigate to={redirectTo} replace />;
    }

    return <>{children}</>;
}