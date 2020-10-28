import React, { useState } from "react";
import { Link } from "react-router-dom";
import Main from "../../layouts/main";
import { Search } from "react-feather";

const Settings = () => {
  const [search, setSearch] = useState("");
  const menus = [
    { label: "Menu", link: "menu" },
    { label: "Category", link: "category" },
    { label: "User", link: "user" },
  ];

  const settings = [];
  menus.forEach((menu, index) => {
    if (menu.label.toUpperCase().indexOf(search.toUpperCase()) === -1) {
      return;
    }

    settings.push(
      <Link
        key={index}
        className="flex items-center text-sm text-gray-800 font-medium border-2 rounded-xl group hover:bg-indigo-700 hover:border-indigo-700 hover:text-white p-2"
        to={`/settings/${menu.link}`}
      >
        <div className="w-8 h-8 bg-gray-400 rounded-xl mr-4 group-hover:bg-indigo-500"></div>
        {menu.label}
      </Link>
    );
  });
  return (
    <Main>
      <div className="flex-1 flex flex-col px-8">
        <div className="group flex items-center py-8">
          <Search className="text-gray-300 mr-2" size={20} />

          <input
            className="w-full text-md text-gray-800 bg-transparent focus:outline-none"
            type="text"
            placeholder="Search..."
            onChange={(event) => setSearch(event.target.value)}
            value={search}
          />
        </div>

        <h6 className="text-xl text-gray-800 font-bold mb-8">Settings</h6>

        <div className="grid grid-cols-3 gap-4">{settings}</div>
      </div>
    </Main>
  );
};

export default Settings;
