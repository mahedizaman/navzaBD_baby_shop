
import { Bell } from "lucide-react";

const Header = () => {
  return (
    <header className="border-b h-14 bg-background flex items-center px-4 py-6 sticky z-10 top-0 gap-2">
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
