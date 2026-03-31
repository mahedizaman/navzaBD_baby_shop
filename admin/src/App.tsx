import { Outlet } from "react-router";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { cn } from "./lib/utils";
import { useState } from "react";

const App = () => {
  // Initialize based on viewport width to avoid setState inside effects.
  const [isOpen, setOpen] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth >= 1024;
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={isOpen} setOpen={setOpen} />
      {isOpen ? (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/30"
          onClick={() => setOpen(false)}
        />
      ) : null}
      <div
        className={cn(
          "flex flex-col flex-1 max-w-[--breakpoint-2xl] transition-all duration-500 ease-in-out py-6 ml-0",
          isOpen ? "lg:ml-64" : "lg:ml-20",
        )}
      >
        <Header
          onMenuClick={() => setOpen((prev) => !prev)}
          isSidebarOpen={isOpen}
        />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default App;
