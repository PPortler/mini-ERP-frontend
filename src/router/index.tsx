import { createBrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/dashboard';
import LoginPage from '../pages';
import ProtectedRoute from './ProtectedRoute';
import GlobalLayout from '../components/layout/GlobalLayout';
import ProductPage from '../pages/products';
import { ROLES } from '../constants/enum/enum';
import CatagoriesPage from '../pages/catagories';
import AuditLogPage from '../pages/audit-log';
import SupplierPage from '../pages/suppliers';
import PoPage from '../pages/po';
import PoProductPage from '../pages/po/product';
import StockTransactionsPage from '../pages/stock-transaction';
import ReportPage from '../pages/reports';
import UserManagementPage from '../pages/users';
// import StockPage from '../pages/products/stock';

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
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
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
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.STAFF, ROLES.VIEWER]}>
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
        path: "/stock-transaction",
        element: (
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.STAFF, ROLES.VIEWER]}>
                <GlobalLayout>
                    <StockTransactionsPage />
                </GlobalLayout>
            </ProtectedRoute>
        ),
    },
    {
        path: "/suppliers",
        element: (
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.STAFF, ROLES.VIEWER]}>
                <GlobalLayout>
                    <SupplierPage />
                </GlobalLayout>
            </ProtectedRoute>
        ),
    },
    {
        path: "/po",
        element: (
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.STAFF, ROLES.VIEWER]}>
                <GlobalLayout>
                    <PoPage />
                </GlobalLayout>
            </ProtectedRoute>
        ),
    },
    {
        path: "po/products",
        element: (
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.STAFF]}>
                <GlobalLayout>
                    <PoProductPage />
                </GlobalLayout>
            </ProtectedRoute>
        ),
    },
    {
        path: "/stock/transactions",
        element: (
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.STAFF, ROLES.VIEWER]}>
                <GlobalLayout>
                    <StockTransactionsPage />
                </GlobalLayout>
            </ProtectedRoute>
        ),
    },
    {
        path: "reports",
        element: (
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <GlobalLayout>
                    <ReportPage />
                </GlobalLayout>
            </ProtectedRoute>
        ),
    },
    {
        path: "users-management",
        element: (
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                <GlobalLayout>
                    <UserManagementPage />
                </GlobalLayout>
            </ProtectedRoute>
        ),
    },
]);