import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import { getRoleCurrent } from "../utils/RoleUtil";

type ProtectedRouteProps = {
    children: ReactNode;
    allowedRoles?: string[];
    redirectTo?: string;
    blockIfAuth?: boolean;
};

export default function ProtectedRoute({
    children,
    allowedRoles,
    redirectTo = "/",
    blockIfAuth = false,
}: ProtectedRouteProps) {
    const { accessToken, loading } = AuthProvider.useAuth();
    const roleCurrent = getRoleCurrent();

    if (loading) {
        return null; // หรือใส่ <Spinner /> / <Loader /> ของ Mantine
    }

    if (blockIfAuth && accessToken && roleCurrent) {
        return <Navigate to="/dashboard" replace />;
    }

    // ถ้า allowedRoles กำหนดและ role ไม่มีสิทธิ์
    if (allowedRoles && (!roleCurrent || !allowedRoles.includes(roleCurrent))) {
        return <Navigate to={redirectTo} replace />;
    }

    return <>{children}</>;
}