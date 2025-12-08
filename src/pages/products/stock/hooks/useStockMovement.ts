import { useEffect, useState } from "react";
import type { StockSummaryType } from "../../../../types/product";

export const useStockMovement = (productId: string, stock?: StockSummaryType) => {
  const [movement, setMovement] = useState({
    categories: ["Current", "In", "Out", "Adjust"],
    series: [
      {
        name: "Stock Summary",
        data: [0, 0, 0, 0],
      },
    ],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!stock) return; // ❗ ป้องกัน undefined
    
    setLoading(true);

    try {
      const chartData = [
        stock.current_stock ?? 0,
        stock.total_in ?? 0,
        stock.total_out ?? 0,
        stock.total_adjust ?? 0,
      ];

      setMovement({
        categories: ["Current", "In", "Out", "Adjust"],
        series: [
          {
            name: "Stock Summary",
            data: chartData,
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  }, [productId, stock]);

  return { movement, loading };
};