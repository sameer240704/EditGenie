import React, { useState } from "react";
import { LeftSidebar, RightSidebar } from "@/components";
import ImageUpload from "@/components/ImageUpload";
import axios from "axios";

interface DroppedFile {
  preview: string;
  name: string;
  file?: File;
}

const ImageEditor: React.FC = () => {
  const [file, setFile] = useState<DroppedFile | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  const handleImageUpload = (file: File | string) => {
    if (typeof file === "string") {
      setFile({ preview: file, name: "pasted-image-url" });
    } else {
      setFile({
        preview: URL.createObjectURL(file),
        name: file.name,
        file: file,
      });
    }
  };

  const removeFile = () => {
    setFile(null);
    setProcessedImage(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (file && file.file) {
      const formData = new FormData();
      formData.append("file", file.file);

      try {
        const response = await axios.post(
          "http://localhost:8000/upload-image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            responseType: "blob",
          }
        );

        const imageUrl = URL.createObjectURL(new Blob([response.data]));
        setProcessedImage(imageUrl);

        console.log("Image uploaded successfully:", response.data);
      } catch (error) {
        console.error("Error uploading the image:", error);
      }
    } else {
      console.error("No file to upload");
    }
  };

  return (
    <div className="relative h-screen w-screen flex justify-center items-center px-1">
      <LeftSidebar />

      <div className="inset-0 bg-gray-100 flex flex-col justify-center items-center p-8 h-full w-full mx-3 my-5">
        <div className="w-full max-w-2xl">
          <ImageUpload onImageUpload={handleImageUpload} />

          <div className="flex justify-around items-center mt-8 gap-x-10">
            {file && (
              <div className="flex flex-col items-center">
                <h2 className="mb-2 font-semibold">Original Image</h2>
                <div className="relative w-96 h-96">
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-full h-full object-contain rounded-lg shadow-md"
                  />
                  <button
                    onClick={removeFile}
                    className="absolute top-2 right-2 bg-red-500 text-white font-semibold py-1 px-3 rounded-full"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}

            {processedImage && (
              <div className="flex flex-col items-center">
                <h2 className="mb-2 font-semibold">Processed Image</h2>
                <div className="relative w-96 h-96">
                  <img
                    src={processedImage}
                    alt="Processed"
                    className="w-full h-full object-contain rounded-lg shadow-md"
                  />
                  <button
                    onClick={removeFile}
                    className="absolute top-2 right-2 bg-red-500 text-white font-semibold py-1 px-3 rounded-full"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div
          className="mt-8 bg-green-500 px-10 py-2 rounded-lg hover:bg-green-600 cursor-pointer active:scale-95"
          onClick={handleSubmit}
        >
          <h1 className="uppercase font-semibold text-xl text-white">Submit</h1>
        </div>
      </div>

      <RightSidebar />
    </div>
  );
};

export default ImageEditor;
