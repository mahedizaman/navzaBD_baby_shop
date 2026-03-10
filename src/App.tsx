import { Outlet } from "react-router";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { cn } from "./lib/utils";
import { useState } from "react";

const App = () => {
  const [isOpen, setOpen] = useState(true);

  return (
    <div className="flex h-screen ">
      <Sidebar isOpen={isOpen} setOpen={setOpen} />
      <div
        className={cn(
          "flex flex-col flex-1 max-w-[--breakpoint-2xl] transition-all duration-500 ease-in-out  py-6",
          isOpen ? "ml-64" : "ml-20",
        )}
      >
        <Header />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default App;
