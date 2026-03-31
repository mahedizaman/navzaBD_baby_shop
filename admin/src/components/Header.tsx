
import { Bell, Menu } from "lucide-react";

type HeaderProps = {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
};

const Header = ({ onMenuClick, isSidebarOpen }: HeaderProps) => {
  return (
    <header className="border-b h-14 bg-background flex items-center px-4 py-6 sticky z-10 top-0 gap-2">
      <button
        type="button"
        aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
        onClick={onMenuClick}
        className="lg:hidden bg-gray-800 text-white p-2 rounded-lg"
      >
        <Menu size={22} />
      </button>
      <button className="bg-gray-800 text-white p-2 rounded-e-3xl rounded-ee-2xl rounded-es-2xl flex ml-auto">
        <Bell size={24} />
      </button>
      <div>
        <div>
          <p>Md Mahedi Zaman</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
