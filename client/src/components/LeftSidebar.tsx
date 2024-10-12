import { useState } from "react";
import { useSidebarState } from "@/context/SidebarContext";
import Logo from "../../public/images/logo.png";
import FavoriteFill from "../../public/icons/favorite_fill.png";
import FavoriteEmpty from "../../public/icons/favorite_empty.png";
import SidebarIcon from "../../public/icons/sidebar.png";
import { FavoritesData } from "@/constants/sidebarData";

const LeftSidebar: React.FC = () => {
  const { expanded, setExpanded } = useSidebarState();
  const [selectedFavorite, setSelectedFavorite] = useState<number | null>(null);

  const handleSidebarState = (): void => {
    setExpanded((prevState) => !prevState);
  };

  const handleFavoriteSelect = (index: number): void => {
    setSelectedFavorite(index);
  };

  return (
    <div
      className={`h-[99%] shadow-xl backdrop-blur-2xl transition-all duration-300 ${
        expanded ? "w-72" : "w-24 px-0"
      } rounded-xl bg-background z-10 p-4`}
    >
      <div className="flex justify-between items-center">
        <img
          src={Logo}
          alt="Logo"
          className="h-8 w-fit transition-transform duration-300 hover:scale-105"
        />

        <div
          className="px-2 py-1 active:bg-gray-900/20 rounded-md cursor-pointer transition-colors duration-200"
          onClick={handleSidebarState}
        >
          <img src={SidebarIcon} className="h-5 w-fit" alt="Sidebar" />
        </div>
      </div>

      <div className={`mt-8 ${!expanded ? "mx-3" : ""}`}>
        <h5
          className={`text-sm mb-4 text-blue-300 font-semibold ${
            !expanded ? "hidden" : ""
          }`}
        >
          Bookmarks
        </h5>
        <ul>
          {FavoritesData.map((favorite, index) => (
            <li
              key={index}
              className={`flex items-center mb-3 py-2 rounded-lg cursor-pointer transition-colors duration-200 
                ${!expanded ? "px-0 justify-center" : "px-3"}
                ${
                  selectedFavorite === index
                    ? "bg-blue-200/50 hover:bg-blue-200/70"
                    : "hover:bg-white/30"
                }`}
              onClick={() => handleFavoriteSelect(index)}
            >
              <img
                src={selectedFavorite === index ? FavoriteFill : FavoriteEmpty}
                className={`h-7 w-fit ${
                  expanded ? "mr-3" : "mr-0"
                } transition-transform duration-200 hover:scale-110`}
                alt="favorite-icon"
              />
              {expanded && (
                <span className="text-lg text-white font-semibold overflow-hidden whitespace-nowrap text-ellipsis tracking-tight">
                  {favorite.name}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LeftSidebar;
