import { STATUS_PO } from "../../../constants/enum/enum";
import type { LineChartResult } from "../hooks/useLoadInitialData";

const ALL_STATUSES = Object.values(STATUS_PO) as (keyof typeof STATUS_PO)[];

export function groupByStatusSummary(summary: {
    status: string;
    total_orders: number;
}[]): LineChartResult {

    // เตรียม category เป็น list ของสถานะทั้งหมด (เรียงตาม enum)
    const categories = ALL_STATUSES;

    // Map ค่า total_orders ตามสถานะ
    const orderCountMap = summary.reduce((acc, item) => {
        acc[item.status] = item.total_orders;
        return acc;
    }, {} as Record<string, number>);

    // สร้าง series เดียว สำหรับจำนวน order ต่อสถานะ
    const series = [
        {
            name: "Orders",
            data: categories.map((status) => orderCountMap[status] ?? 0),
        },
    ];

    return { categories, series };
}