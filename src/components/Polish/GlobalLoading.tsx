import { Loader } from "@mantine/core";
import { LoadingProvider } from "../../contexts/LoadingContext";

export default function GlobalLoading() {
    const { openLoading } = LoadingProvider.useLoading();

    // if (true) return null;
    if (!openLoading) return null;

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                // background: "rgba(255, 255, 255, 0.8)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999,
            }}
        >
            <Loader size="lg" />
        </div>
    );
}