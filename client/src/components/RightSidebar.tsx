import React from "react";
import { Image, Palette, Copyright } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useGlobalState } from "@/context/GlobalStateProvider";

const tools = [
  {
    name: "Background Removal",
    icon: Image,
    description: "Remove unwanted backgrounds",
  },
  {
    name: "Color Enhancer",
    icon: Palette,
    description: "Boost color vibrancy",
  },
  {
    name: "Image Copywriter",
    icon: Copyright,
    description: "Add a watermark",
  },
  {
    name: "Focus Effect",
    icon: Image,
    description: "Add focus to your images",
  },
];

const RightSidebar: React.FC = () => {
  const { selected, setSelected } = useGlobalState();

  return (
    <div className="h-[99%] w-96 rounded-2xl z-10 py-4 px-2 transition-all shadow-2xl bg-background">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <Avatar className="w-12 h-12">
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="User avatar"
            />
            <AvatarFallback className="bg-blue-500">CN</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold text-blue-500">Quick Tools</h2>
            <p className="text-sm text-gray-200">Image editing made easy</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {tools.map((tool, index) => {
          const IconComponent = tool.icon;
          const isSelected = selected === tool.name;

          return (
            <Button
              key={index}
              onClick={() => setSelected(tool.name)}
              className={`h-16 w-full justify-start space-x-2 transition-colors duration-200 ${
                isSelected
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              <IconComponent
                className={`w-5 h-5 ${
                  isSelected ? "text-white" : "text-blue-600 dark:text-blue-400"
                }`}
                strokeWidth={1.5}
              />
              <div className="flex flex-col items-start">
                <span className="text-md">{tool.name}</span>
                <span className="text-xs text-gray-300">
                  {tool.description}
                </span>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default RightSidebar;
