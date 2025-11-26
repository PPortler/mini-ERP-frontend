import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import { notifications } from '@mantine/notifications';

type NotificationType = 'success' | 'error' | 'info';

interface NotifyProps {
    title?: string;
    message: string;
    type?: NotificationType;
    autoClose?: number; 
}

export const notify = ({
    title,
    message,
    type = 'info',
    autoClose = 3000,
}: NotifyProps) => {
    let icon;
    let color;

    switch (type) {
        case 'success':
            icon = <CheckCircleIcon />;
            color = 'green';
            break;
        case 'error':
            icon = <ErrorIcon />;
            color = 'red';
            break;
        default:
            icon = <InfoIcon />;
            color = 'blue';
            break;
    }

    notifications.show({ title, message, color, icon, autoClose });
};