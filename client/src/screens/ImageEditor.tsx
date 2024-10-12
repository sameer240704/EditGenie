import React, { useState } from "react";
import { LeftSidebar, RightSidebar } from "@/components";
import ImageUpload from "@/components/ImageUpload";

interface DroppedFile {
  preview: string;
  name: string;
}

const ImageEditor: React.FC = () => {
  const [file, setFile] = useState<DroppedFile | null>(null);

  const handleImageUpload = (file: File | string) => {
    if (typeof file === "string") {
      setFile({ preview: file, name: "pasted-image-url" });
    } else {
      setFile({
        preview: URL.createObjectURL(file),
        name: file.name,
      });
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <div className="relative h-screen w-screen flex justify-center items-center px-1">
      <LeftSidebar />

      <div className="inset-0 bg-gray-100 flex justify-center items-center p-8 h-full w-full mx-3 my-5">
        <div className="w-full h-full">
          <ImageUpload onImageUpload={handleImageUpload} />

          {/* Popup Image Preview */}
          {file && (
            <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 w-96 p-4 bg-white shadow-lg rounded-lg">
              <div className="relative">
                <img
                  src={file.preview}
                  alt={file.name}
                  className="w-full h-auto object-contain rounded-lg"
                />
                <button
                  onClick={removeFile}
                  className="absolute top-2 right-2 bg-red-500 text-white font-semibold py-1 px-3 rounded-full"
                >
                  Remove Image
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <RightSidebar />
    </div>
  );
};

export default ImageEditor;
