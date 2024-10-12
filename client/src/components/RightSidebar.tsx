import { useSidebarState } from "@/context/SidebarContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const RightSidebar: React.FC = () => {
  return (
    <div className="h-[99%] w-96 rounded-xl z-10 p-3 px-4 transition-all shadow-xl bg-background">
      <div className="flex justify-between items-center">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default RightSidebar;
