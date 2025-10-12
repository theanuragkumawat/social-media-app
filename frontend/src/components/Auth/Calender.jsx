import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Get years for dropdown (e.g., 1920-2025)
const getYears = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 70 }, (_, i) => currentYear - i);
};

function DOBPicker({ value, onChange }) {
  const [year, setYear] = useState(value?.getFullYear() || "");
  const [month, setMonth] = useState(value?.getMonth() + 1 || "");
  const [day, setDay] = useState(value?.getDate() || "");

  // Days depend on year/month
  const daysInMonth = year && month ? new Date(year, month, 0).getDate() : 31;

  const handleChange = (type, val) => {
    if (type === "year") setYear(val);
    if (type === "month") setMonth(val);
    if (type === "day") setDay(val);
  };

  useEffect(() => {
    if(year && month && day){
      const date = new Date(year, month - 1, day);
      onChange(date);
    }
  }, [year,month,day]);

  return (
    <div className="flex gap-2">
      <Select
        value={day}
        onValueChange={(value) => handleChange("day", value)}
        className={""}
      >
        <SelectTrigger className="rounded-xs dark:bg-background">
          <SelectValue placeholder="Day" />
        </SelectTrigger>
        <SelectContent className="rounded-xs dark:bg-background">
          {/* <option value="">Day</option> */}
          {[...Array(daysInMonth).keys()].map((d) => (
            <SelectItem key={d + 1} value={d + 1} className="rounded-xs">
              {d + 1}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={month}
        onValueChange={(value) => handleChange("month", value)}
      >
        <SelectTrigger className="rounded-xs dark:bg-background ">
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent className="rounded-xs dark:bg-background">
          {/* <option value="">Month</option> */}
          {Array.from({ length: 12 }).map((_, m) => (
            <SelectItem key={m + 1} value={m + 1} className="rounded-xs">
              {m + 1}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={year}
        onValueChange={(value) => handleChange("year", value)}
      >
        <SelectTrigger className="rounded-xs dark:bg-background">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent className="rounded-xs dark:bg-background">
          {/* <option value="">Year</option> */}
          {getYears().map((y) => (
            <SelectItem key={y} value={y} className="rounded-xs">
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default DOBPicker;
