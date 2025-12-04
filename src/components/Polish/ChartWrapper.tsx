import React from "react";
import Chart from "react-apexcharts";
import { Skeleton, Card } from "@mantine/core";
import type { ApexOptions } from "apexcharts";

interface ChartWrapperProps {
    options: ApexOptions;
    series: ApexAxisChartSeries | ApexNonAxisChartSeries;
    type: "line" | "bar" | "area" | "pie";
    height?: number;
    loading?: boolean;
    cardTitle?: string; // ใส่หัวข้อ chart ได้
}

const ChartWrapper: React.FC<ChartWrapperProps> = ({
    options,
    series,
    type,
    height = 300,
    loading = false,
    cardTitle,
}) => {
    return (
        <Card shadow="sm" padding="lg">
            {cardTitle && <h3 style={{ marginBottom: 16 }}>{cardTitle}</h3>}
            {loading ? (
                <Skeleton variant="rectangular" width="100%" height={height} />
            ) : (
                <Chart options={options} series={series} type={type} height={height} />
            )}
        </Card>
    );
};

export default ChartWrapper;