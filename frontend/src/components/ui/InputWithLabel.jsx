/* eslint-disable react/prop-types */
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";

export const InputWithLabel = ({
  label,
  type = "text",
  placholder,
  value,
  setValue,
  className = "",
  ...prop
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="" className="text-sm">
        {label}
      </label>
      <Input
        value={value ? value : ""}
        onChange={(e) => {
          setValue(e.target.value);
        //   trigger(watchKey);
        }}
        type={type}
        className={cn("w-full bg-white", className)}
        placeholder={placholder}
        {...prop}
      />
      {/* <span className="text-[13px] text-red-500 min-h-5">
        {error && error[watchKey] && error[watchKey].message}
      </span> */}
    </div>
  );
};
