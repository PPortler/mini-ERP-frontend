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
    const { accessToken, role } = AuthProvider.useAuth();

    if (blockIfAuth && accessToken && role) {
        return <Navigate to="/dashboard" replace />;
    }

    // ถ้า allowedRoles กำหนดและ role ไม่มีสิทธิ์
    if (allowedRoles && (!role || !allowedRoles.includes(role))) {
        return <Navigate to={redirectTo} replace />;
    }

    return <>{children}</>;
}