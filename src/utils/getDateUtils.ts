export const parseDate = (isoString: string) => {
  const date = new Date(isoString);

  // timezone-safe (ปรับให้เป็นเวลาท้องถิ่นอัตโนมัติ)
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 0 → 11
  const day = date.getDate();

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return {
    dateObject: date,
    year,
    month,
    day,
    hours,
    minutes,
    seconds,
    // สำหรับแสดงผล
    dateString: `${day.toString().padStart(2, "0")}-${month
      .toString()
      .padStart(2, "0")}-${year}`,
    timeString: `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`,
    // สำหรับ filter
    yyyymmdd: `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`,
  };
};