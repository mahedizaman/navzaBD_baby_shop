import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  ImageDown,
  ImageIcon,
  Layers,
  LayoutDashboard,
  LogOut,
  Package,
  PanelRightClose,
  ReceiptIndianRupee,
  ShoppingCart,
  UserCircle,
  Users2,
} from "lucide-react";
import { Link, useLocation } from "react-router";
import { Button } from "./ui/button";

const Sidebar = ({isOpen,setOpen}) => {
  const location = useLocation();
  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={22} />,
      path: "/dashboard",
    },
    {
      name: "Account",
      icon: <UserCircle size={22} />,
      path: "/dashboard/account",
    },
    {
      name: "Orders",
      icon: <ShoppingCart size={22} />,
      path: "/dashboard/order",
    },
    {
      name: "Products",
      icon: <Package size={22} />,
      path: "/dashboard/product",
    },
    {
      name: "Banners",
      icon: <ImageIcon size={22} />,
      path: "/dashboard/banner",
    },
    {
      name: "Brands",
      icon: <ImageDown size={22} />,
      path: "/dashboard/brand",
    },
    {
      name: "Invoices",
      icon: <ReceiptIndianRupee size={22} />,
      path: "/dashboard/invoices",
    },
    {
      name: "Categories",
      icon: <Layers size={22} />,
      path: "/dashboard/categories",
    },
    { name: "Users", icon: <Users2 size={22} />, path: "/dashboard/users" },
  ];
  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex flex-col border-r border-white/10 shadow-xl transition-all duration-500 ease-in-out",
        "bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 text-white",
        isOpen ? "w-64" : "w-20",
      )}
    >
      <div
        className={cn(
          "flex items-center py-6 px-4",
          isOpen ? "justify-between" : "justify-center",
        )}
      >
        {isOpen ? (
          <h2 className="text-xl font-bold tracking-tight whitespace-nowrap animate-in fade-in duration-500">
            NavzaBD <span className="text-indigo-400">Admin</span>
          </h2>
        ) : (
          <div className="text-xl font-bold bg-indigo-500 w-10 h-10 flex items-center justify-center rounded-lg shadow-lg">
            N<sup className="text-[10px] lowercase">bd</sup>
          </div>
        )}

        {isOpen && (
          <PanelRightClose
            size={20}
            className="cursor-pointer text-slate-400 hover:text-white transition-colors animate-caret-blink"
            onClick={() => setOpen(false)}
          />
        )}
      </div>

      {!isOpen && (
        <div className="flex justify-center mt-2">
          <PanelRightClose
            size={20}
            className="cursor-pointer rotate-180 text-slate-400 hover:text-white transition-colors animate-pulse"
            onClick={() => setOpen(true)}
          />
        </div>
      )}

      <div className="flex flex-col gap-1 px-3 mt-4">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={index}
              to={item.path}
              className={cn(
                "flex items-center p-3 rounded-xl transition-all duration-300 group",
                isOpen ? "gap-3" : "justify-center",
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                  : "text-slate-400 hover:bg-white/5 hover:text-white",
              )}
            >
              <div
                className={cn(
                  "transition-transform duration-300",
                  isActive && "scale-110",
                )}
              >
                {item.icon}
              </div>

              {isOpen && (
                <span
                  className={cn(
                    "text-sm font-medium transition-opacity transition-transform duration-300",
                    isOpen
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-2",
                  )}
                >
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </div>
      <div className="p-4 mt-auto border-t border-white/5">
        <Button
          variant="destructive"
          className={cn(
            "flex items-center gap-3 transition-all duration-300 bg-red-600 text-white  hover:bg-red-800/99 hover:text-white border border-red-600/20",
            isOpen
              ? "w-full justify-start px-4"
              : "w-12 h-12 justify-center p-0 mx-auto rounded-xl",
          )}
        >
          <LogOut size={22} className={cn(!isOpen && "shrink-0")} />
          {isOpen && <span className="font-semibold text-sm">Logout</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
