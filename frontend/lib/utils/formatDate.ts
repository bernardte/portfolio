// 以 date-fns 为例
import {
  formatDistanceToNow,
  format,
  isThisYear,
  parseISO,
  isValid
} from "date-fns";

export function formatDate(dateInput: string | Date | null) {
  if (!dateInput || dateInput === "undefined" || dateInput === "null") {
    return "-";
  }

  // 安全解析
  let date: Date;
  if (dateInput instanceof Date) {
    date = dateInput;
  } else {
    // 尝试 parseISO，如果失败则回退到 new Date()
    date = parseISO(dateInput);
    if (!isValid(date)) {
      date = new Date(dateInput);
    }
  }

  // 双重校验有效性
  if (!isValid(date) || isNaN(date.getTime())) {
    return "-";
  }

  const now = new Date();
  const diffInDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);

  if (diffInDays < 7) {
    return formatDistanceToNow(date, { addSuffix: true });
  }

  if (isThisYear(date)) {
    return format(date, "MMM d");
  }

  return format(date, "MMM d, yyyy");
}
