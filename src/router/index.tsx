import { createBrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/dashboard';
import LoginPage from '../pages';
import ProtectedRoute from './ProtectedRoute';
import GlobalLayout from '../components/Layout/GlobalLayout';
import ProductPage from '../pages/products';
import { ROLES } from '../constants/enum/enum';
import CatagoriesPage from '../pages/catagories';
import AuditLogPage from '../pages/audit-log';
import StockPage from '../pages/stock';

export const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <ProtectedRoute blockIfAuth>
                <LoginPage />
            </ProtectedRoute>
        ),
    },
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.STAFF, ROLES.VIEWER]}>
                <GlobalLayout>
                    <Dashboard />
                </GlobalLayout>
            </ProtectedRoute>
        ),
    },
    {
        path: "/products",
        element: (
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.STAFF, ROLES.VIEWER]}>
                <GlobalLayout>
                    <ProductPage />
                </GlobalLayout>
            </ProtectedRoute>
        ),
    },
    {
        path: "/catagories",
        element: (
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.STAFF]}>
                <GlobalLayout>
                    <CatagoriesPage />
                </GlobalLayout>
            </ProtectedRoute>
        ),
    },
    {
        path: "/audit-log",
        element: (
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <GlobalLayout>
                    <AuditLogPage />
                </GlobalLayout>
            </ProtectedRoute>
        ),
    },
    {
        path: "/stock",
        element: (
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.STAFF, ROLES.VIEWER]}>
                <GlobalLayout>
                    <StockPage />
                </GlobalLayout>
            </ProtectedRoute>
        ),
    },
]);