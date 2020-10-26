import React from "react";
import { Link } from "react-router-dom";
import Main from "../../layouts/main";
import { Search } from "react-feather";

const Settings = () => {
  const settings = [
    { label: "Menu", link: "menu" },
    { label: "Category", link: "category" },
    { label: "User", link: "user" },
  ];

  return (
    <Main>
      <div className="flex-1 flex flex-col px-8">
        <div className="group flex items-center py-8">
          <Search className="text-gray-300 mr-2" size={20} />

          <input
            className="text-md text-gray-800 w-full bg-transparent focus:outline-none"
            type="text"
            placeholder="Search..."
          />
        </div>

        <h6 className="text-xl text-gray-800 font-bold mb-8">Settings</h6>

        <div className="grid grid-cols-3 gap-4">
          {settings.map((setting, index) => (
            <Link
              key={index}
              className="flex items-center text-sm text-gray-800 font-medium border-2 rounded-xl group hover:bg-indigo-700 hover:border-indigo-700 hover:text-white p-2"
              to={`/settings/${setting.link}`}
            >
              <div className="w-8 h-8 bg-gray-400 rounded-xl mr-4 group-hover:bg-indigo-500"></div>
              {setting.label}
            </Link>
          ))}
        </div>
      </div>
    </Main>
  );
};

export default Settings;
