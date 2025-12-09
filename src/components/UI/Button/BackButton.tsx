import { IconButton, type IconButtonProps } from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

interface BackButtonProps extends IconButtonProps {
    to?: number | string;
}

export function BackButton({ to = -1, ...props }: BackButtonProps) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (typeof to === "number") navigate(to);
        else navigate(to);
    };

    return (
        <IconButton
            onClick={handleClick}
            aria-label="back"
            color="primary"
            size="medium"
            {...props}
        >
            <ArrowBackIcon />
        </IconButton>
    );
}