import { NavLink } from "react-router-dom";

import { Heart, Home, Search, SquarePlus, User, ChefHat } from "lucide-react";

const BottomTabs = () => {
  const tabs = [
    { to: "/", icon: <Home />, label: "Home" },
    { to: "/search", icon: <Search />, label: "Search" },
    { to: "/create", icon: <SquarePlus />, label: "Create" },
    { to: "/chefs", icon: <ChefHat />, label: "Hire" },
    { to: "/profile", icon: <User />, label: "Profile" },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-black flex justify-around items-center py-2 shadow-md z-50 md:hidden">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `flex flex-col items-center text-gray-500 transition-all ${
                isActive ? "text-blue-500 scale-110" : "hover:text-blue-400"
              }`
            }
          >
            <div className="text-2xl">{tab.icon}</div>
            <span className="text-xs mt-1">{tab.label}</span>
          </NavLink>
        ))}
      </nav>

      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-56 bg-white border-r border-gray-200 z-25">
        <div className="flex flex-col justify-between w-full h-full p-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-2">
              <ChefHat />
              <span className="font-semibold text-lg">Yummio</span>
            </div>
            <nav className="flex flex-col gap-1">
              {tabs.map((tab) => (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 m-3 font-bold py-2 rounded-lg text-gray-600 transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "hover:bg-gray-100 hover:text-gray-800"
                    }`
                  }
                >
                  <div className="text-xl">{tab.icon}</div>
                  <span className="text-sm">{tab.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
          <div>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 transition-colors ${
                  isActive ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100 hover:text-gray-800"
                }`
              }
            >
              {/* <User />
              <span className="text-sm">Profile</span> */}
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
};

export default BottomTabs;