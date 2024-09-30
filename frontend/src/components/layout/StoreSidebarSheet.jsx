/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { MenuIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "../ui/sheet";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function StoreSideBarSheet({ menuItems }) {
    const [sheetState,setSheetState]=useState(false)
  return (
    <Sheet defaultOpen={sheetState} onOpenChange={setSheetState}>
      <SheetTrigger>
        {" "}
        <button className="lg:hidden absolute left-2 top-2 cursor-pointer p-2 rounded-full bg-white border shadow-md">
          <MenuIcon className="size-6 " />
        </button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetDescription className="p-3 overflow-y-auto">
            <div className="custom-scrollbar w-full px-2 h-screen overflow-auto pb-28">
              {menuItems.map((item, i) => (
                <div key={i} className="w-full">
                  <div className="w-full h-8 flex items-center text-black border-y py-3">
                    {item.section}
                  </div>
                  <div className="ml-2 flex flex-col">
                    {item?.items?.map((it, I) => (
                      <Link to={it?.path}
                      onClick={()=>setSheetState(false)}
                        key={I}
                        className="h-9 flex items-center gap-2 py-3"
                      >
                        <it.icon className="w-5"/>
                        {it.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
