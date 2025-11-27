import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { MantineProvider } from '@mantine/core';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { Notifications } from '@mantine/notifications';
import { AppProviders } from './contexts/AppProvider';
import GlobalLoading from './components/Polish/GlobalLoading';

export default function App() {
  return (
    <MantineProvider >
      <AppProviders>
        <Notifications position="top-right" zIndex={2077} />
        <GlobalLoading />
        <RouterProvider router={router} />
      </AppProviders>
    </MantineProvider>
  );
}