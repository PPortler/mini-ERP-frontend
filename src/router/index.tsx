import { createBrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/dashboard';
import LoginPage from '../pages';
import ProtectedRoute from './ProtectedRoute';
import GlobalLayout from '../components/Layout/GlobalLayout';
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
import { getRolesByPath } from '../utils/getRoleByPath';
import StockProductPage from '../pages/products/stock';
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
            <ProtectedRoute allowedRoles={getRolesByPath("/dashboard")}>
                <GlobalLayout>
                    <Dashboard />
                </GlobalLayout>
            </ProtectedRoute>
        ),
    },
    {
        path: "/products",
        element: (
            <ProtectedRoute allowedRoles={getRolesByPath("/products")}>
                <GlobalLayout>
                    <ProductPage />
                </GlobalLayout>
            </ProtectedRoute>
        ),
    },
    {
        path: "/products/stock",
        element: (
            <ProtectedRoute allowedRoles={getRolesByPath("/products")}>
                <GlobalLayout>
                    <StockProductPage />
                </GlobalLayout>
            </ProtectedRoute>
        ),
    },
    {
        path: "/catagories",
        element: (
            <ProtectedRoute allowedRoles={getRolesByPath("/catagories")}>
                <GlobalLayout>
                    <CatagoriesPage />
                </GlobalLayout>
            </ProtectedRoute>
        ),
    },
    {
        path: "/audit-log",
        element: (
            <ProtectedRoute allowedRoles={getRolesByPath("/audit-log")}>
                <GlobalLayout>
                    <AuditLogPage />
                </GlobalLayout>
            </ProtectedRoute>
        ),
    },
    {
        path: "/stock-transaction",
        element: (
            <ProtectedRoute allowedRoles={getRolesByPath("/stock-transaction")}>
                <GlobalLayout>
                    <StockTransactionsPage />
                </GlobalLayout>
            </ProtectedRoute>
        ),
    },
    {
        path: "/suppliers",
        element: (
            <ProtectedRoute allowedRoles={getRolesByPath("/suppliers")}>
                <GlobalLayout>
                    <SupplierPage />
                </GlobalLayout>
            </ProtectedRoute>
        ),
    },
    {
        path: "/po",
        element: (
            <ProtectedRoute allowedRoles={getRolesByPath("/po")}>
                <GlobalLayout>
                    <PoPage />
                </GlobalLayout>
            </ProtectedRoute>
        ),
    },
    {
        path: "po/products",
        element: (
            <ProtectedRoute allowedRoles={getRolesByPath("/po")}>
                <GlobalLayout>
                    <PoProductPage />
                </GlobalLayout>
            </ProtectedRoute>
        ),
    },
    {
        path: "reports",
        element: (
            <ProtectedRoute allowedRoles={getRolesByPath("/reports")}>
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