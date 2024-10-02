import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function TaskAddEdit() {
  return (
    <main className="w-full h-full bg-white rounded-xl border shadow-sm p-5">
      <div className="w-full">
        <h1 className="text-[21px] font-semibold">Add new Task</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 mt-5 gap-5">
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Staff" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="mt-5 w-full border rounded-md p-5 bg-slate-100/50 shadow-sm">
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-3">
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="sm">
                  Task title
                </label>
                <Input placeholder="Task Title" />
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="sm">
                  Task deadline
                </label>
                <Input placeholder="Task Title" type="date" />
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-6 gap-4 overflow-y-auto">
            <div className="md:col-span-5 h-full ">
              <div className="flex flex-col gap-1 h-full ">
                <label htmlFor="" className="sm">
                  Task Description
                </label>
                <Textarea className="w-full h-full"/>
              </div>
            </div>
            <label className="md:col-span-1 border rounded-md max-h-[140px] flex justify-center items-center text-sm shadow-sm bg-gray-100 cursor-pointer">
                <span className="text-center mx-4">Click and upload document</span>
            </label>
          </div>
        </div>
        <div className="mt-5 flex justify-end">
            <Button>Add Task</Button>
        </div>
      </div>
    </main>
  );
}
