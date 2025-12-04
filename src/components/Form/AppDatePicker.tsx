import React, { useState } from "react";
import { Skeleton } from "@mantine/core";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

interface AppDatePickerProps {
  label?: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  views?: ("year" | "month" | "day")[];
  loading?: boolean;
  width?: number;
}

const AppDatePicker: React.FC<AppDatePickerProps> = ({
  label = "Select Date",
  value,
  onChange,
  views = ["year", "month", "day"],
  loading = false,
  width = 240,
}) => {
  const [tempValue, setTempValue] = useState<Date | null>(value);

  if (loading) {
    return <Skeleton variant="rectangular" width={width} height={40} />;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        views={views}
        label={label}
        value={tempValue}
        onChange={(newValue) => setTempValue(newValue)} // แค่เปลี่ยนค่า temp
        onAccept={(newValue) => onChange(newValue)} // กด OK แล้วเปลี่ยนจริง
        slotProps={{
          textField: {
            size: "small",
            fullWidth: false,
            sx: { minWidth: width },
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default AppDatePicker;