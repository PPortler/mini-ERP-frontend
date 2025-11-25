import { createBrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/dashboard';
import LoginPage from '../pages';
import ProtectedRoute from './ProtectedRoute';
import GlobalLayout from '../components/layout/GlobalLayout';
import ProductPage from '../pages/products';

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
            <ProtectedRoute allowedRoles={[1, 2, 3]}>
               <GlobalLayout>
                 <Dashboard />
               </GlobalLayout>
            </ProtectedRoute>
        ),
    },
    {
        path: "/products",
        element: (
            <ProtectedRoute allowedRoles={[1, 2, 3]}>
               <GlobalLayout>
                 <ProductPage />
               </GlobalLayout>
            </ProtectedRoute>
        ),
    },
]);