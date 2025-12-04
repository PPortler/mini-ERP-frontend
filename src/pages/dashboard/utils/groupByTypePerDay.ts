import dayjs from "dayjs";
import type { StockMovementChart } from "../hooks/useLoadInitialData";
import type { StockMovementItemType } from "../../../types/reports";
import { TYPE_STOCK_TRANSECTION } from "../../../constants/enum/enum";

export interface StockMovementItem {
    productName: string;
    quantity: number;
    type: keyof typeof TYPE_STOCK_TRANSECTION;
    date: string;
}

export function groupByTypePerDay(data: StockMovementItemType[]): StockMovementChart {
    const grouped: Record<string, { IN: number; OUT: number; ADJUST: number }> = {};

    data.forEach((item) => {
        const date = dayjs(item.created_at).format("YYYY-MM-DD");

        if (!grouped[date]) {
            grouped[date] = { IN: 0, OUT: 0, ADJUST: 0 };
        }

        grouped[date][item.type as keyof typeof TYPE_STOCK_TRANSECTION] += item.quantity;
    });

    const categories = Object.keys(grouped).sort();

    const series = [
        { name: "IN", data: categories.map((d) => grouped[d].IN) },
        { name: "OUT", data: categories.map((d) => grouped[d].OUT) },
        { name: "ADJUST", data: categories.map((d) => grouped[d].ADJUST) },
    ];

    return { categories, series };
}