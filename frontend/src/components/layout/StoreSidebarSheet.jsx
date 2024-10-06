/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { MenuIcon } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "../ui/sheet";
import { NavLink } from "react-router-dom";
import { useRef, useState } from "react";

export default function StoreSideBarSheet({ menuItems }) {
  
  const sheetCloseRef=useRef()
  return (
    <Sheet >
      <SheetTrigger>
        <span className="lg:hidden absolute left-2 top-1 cursor-pointer p-2 rounded-full bg-white/55 border shadow-md">
          <MenuIcon className="size-6 " />
        </span>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetDescription className="p-3 overflow-y-auto ">
            <SheetClose ref={sheetCloseRef} className="hidden"></SheetClose>
            <div className="custom-scrollbar w-full px-2 h-screen overflow-auto pb-28">
              {menuItems.map((item, i) => (
                <div key={i} className="w-full">
                  <div className="w-full h-10 flex items-center text-black border-y py-3">
                    {item.section}
                  </div>
                  <div className="ml-2 flex flex-col">
                    {item?.items?.map((it, I) => (
                      <NavLink
                        to={it?.path}
                        onClick={() => sheetCloseRef?.current?.click()}
                        key={I}
                        className="h-9 flex items-center gap-2 py-3"
                      >
                        <it.icon className="w-5" />
                        {it.label}
                      </NavLink>
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
