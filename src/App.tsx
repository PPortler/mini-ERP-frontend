import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { AuthProvider } from './contexts/AuthContext';
import { Notifications } from '@mantine/notifications';

export default function App() {
  return (
    <MantineProvider >
      <AuthProvider>
        <Notifications position="top-right" zIndex={2077} />
        <RouterProvider router={router} />
      </AuthProvider>
    </MantineProvider>
  );
}