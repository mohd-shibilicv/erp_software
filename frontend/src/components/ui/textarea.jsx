import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-base leading-relaxed transition-colors duration-200 ease-in-out",
        "placeholder:text-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-100",
        "dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500",
        "dark:focus:border-purple-400 dark:focus:ring-purple-800",
        "resize-y",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea }
