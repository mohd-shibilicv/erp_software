import { format } from "date-fns";

export const formatDateForBackend = (date) => {
  return date ? format(new Date(date), "yyyy-MM-dd") : null;
};
