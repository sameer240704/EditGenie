import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, ChevronDown } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { saveAs } from "file-saver";

interface DownloadProps {
  imageUrl: string;
}

const DownloadArea: React.FC<DownloadProps> = ({ imageUrl }) => {
  const [selectedType, setSelectedType] = useState<string>("png");

  const handleDownload = () => {
    const fileName = `EditGenie.${selectedType}`;

    const fileUrl = `${imageUrl}`;

    saveAs(fileUrl, fileName);
  };

  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <div className="w-full h-12 flex justify-between items-center rounded-xl bg-blue-500 shadow-md hover:shadow-lg cursor-pointer px-2">
        <div
          className="w-3/4 text-center text-lg flex justify-center items-center gap-x-2"
          onClick={handleDownload}
        >
          <Download className="h-5 w-5 text-white" />
          <h1 className="text-white font-semibold tracking-wider">Download</h1>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="text-center text-lg text-white font-bold">
            <ChevronDown />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuLabel className="text-md mb-2">
              File Format
            </DropdownMenuLabel>
            <DropdownMenuItem>
              <RadioGroup
                value={selectedType}
                onValueChange={setSelectedType}
                className="flex flex-col gap-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="png" id="option-png" />
                  <Label htmlFor="option-png">PNG</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="jpg" id="option-jpg" />
                  <Label htmlFor="option-jpg">JPG</Label>
                </div>
              </RadioGroup>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default DownloadArea;
