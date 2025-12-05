import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { MantineProvider } from '@mantine/core';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { Notifications } from '@mantine/notifications';
import GlobalLoading from './components/Polish/GlobalLoading';
import { useEffect } from 'react';
import { authActions } from './stores/authUserStore';

export default function App() {
  useEffect(() => {
    authActions.initializeAuth();
  }, []);
  return (
    <MantineProvider >
      <Notifications position="top-right" zIndex={2077} />
      <GlobalLoading />
      <RouterProvider router={router} />
    </MantineProvider>
  );
}