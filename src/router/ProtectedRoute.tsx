import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getRoleCurrent } from "../utils/RoleUtil";
import { useStore } from "@nanostores/react";
import { $authUser } from "../stores/authUserStore";

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
    const authUser = useStore($authUser);
    const roleCurrent = getRoleCurrent();

    if (authUser === undefined) {
        return null; 
    }

    if (blockIfAuth && authUser?.access_token && roleCurrent) {
        return <Navigate to="/dashboard" replace />;
    }

    // ถ้า allowedRoles กำหนดและ role ไม่มีสิทธิ์
    if (allowedRoles && (!roleCurrent || !allowedRoles.includes(roleCurrent))) {
        return <Navigate to={redirectTo} replace />;
    }

    return <>{children}</>;
}