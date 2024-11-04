import React, { useState } from "react";
import {
  DownloadArea,
  ImageDisplay,
  ImageUpload,
  LeftSidebar,
  RightSidebar,
} from "@/components";
import axios from "axios";
import { toast } from "sonner";
import { X } from "lucide-react";
import { useGlobalState } from "@/context/GlobalStateProvider";

interface DroppedFile {
  preview: string;
  name: string;
  file?: File;
}

const ImageEditor: React.FC = () => {
  const [file, setFile] = useState<DroppedFile | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { selected } = useGlobalState();

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
    setIsSubmitting(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsSubmitting(true);
    if (file && file.file) {
      const formData = new FormData();
      formData.append("file", file.file);
      formData.append("service", selected);

      toast.success("Image uploaded successfully");

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
      } catch (error) {
        toast.error("Error uploading the image");
      }
    } else {
      toast.error("No file to upload");
    }
  };

  return (
    <div className="relative h-screen w-screen flex justify-center items-center px-1">
      <LeftSidebar />

      <div className="inset-0 bg-gray-100 flex flex-col justify-center items-center p-8 h-full w-full mx-3 my-5">
        <div className="absolute top-4 mb-6 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg text-center">
          <h2 className="text-lg font-semibold">
            {selected ? `Applying Tool: ${selected}` : "No Tool Selected"}
          </h2>
        </div>

        <div className="w-11/12">
          <ImageUpload onImageUpload={handleImageUpload} />
          {isSubmitting && (
            <div className="relative flex justify-between items-center mt-8 gap-x-10 border-2 px-5 py-6 shadow-md bg-white rounded-xl">
              <X
                className="absolute right-5 top-5 hover:cursor-pointer hover:text-red-500 active:text-red-700"
                onClick={removeFile}
              />
              <div className="flex justify-center items-center gap-x-5">
                {file ? (
                  <ImageDisplay
                    title="Original Image"
                    imageUrl={file.preview}
                    imageName={file.name}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center w-96 h-96 bg-gray-200 rounded-lg shadow-inner">
                    <span className="text-gray-500">No Original Image</span>
                  </div>
                )}

                {processedImage ? (
                  <ImageDisplay
                    title="Processed Image"
                    imageUrl={processedImage}
                    animate={true}
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <h2 className="mb-2 font-bold tracking-tighter">
                      Processed Image
                    </h2>
                    <div className="relative w-96 h-96 overflow-hidden rounded-lg">
                      <img
                        src={file?.preview}
                        alt={file?.name}
                        className="w-full h-full object-contain shadow-md"
                        style={{ filter: "blur(20px)" }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <DownloadArea imageUrl={processedImage} />
            </div>
          )}
        </div>

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
