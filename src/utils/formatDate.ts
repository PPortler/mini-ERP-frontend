import { format } from "date-fns";

export const toDDMMYYYY = (date: Date | null) => {
  if (!date) return "";
  return format(date, "dd-MM-yyyy");
};
export const toMMYYYY = (date: Date | null) => {
  if (!date) return "";
  return format(date, "MM-yyyy");
};

export const parseMonthString = (month: string) => {
  if (!month) return null;
  const [mm, yyyy] = month.split("-");
  return new Date(Number(yyyy), Number(mm) - 1, 1); // YYYY, MM-1, DAY
};

export const parseDDMMYYYY = (value: string) => {
  if (!value) return null;
  const [dd, mm, yyyy] = value.split("-");
  return new Date(`${yyyy}-${mm}-${dd}T00:00:00`);
};