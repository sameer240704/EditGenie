import React, { useState, useRef, useEffect } from "react";
import {
  DownloadArea,
  ImageDisplay,
  ImageUpload,
  LeftSidebar,
  RightSidebar,
} from "@/components";
import axios from "axios";
import { toast } from "sonner";
import { X, Palette, Check } from "lucide-react";
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
  const [watermarkText, setWatermarkText] = useState<string>("Copyright");
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
    setSelectedColor(null);
  };

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (isModalOpen && imageRef.current && canvasRef.current) {
      const img = imageRef.current;
      const canvas = canvasRef.current;

      img.onload = () => {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
        }
      };
    }
  }, [isModalOpen]);

  const handleModalClick = (event: React.MouseEvent<HTMLImageElement>) => {
    if (!imageRef.current || !canvasRef.current) return;
    const img = imageRef.current;
    const rect = img.getBoundingClientRect();

    const scaleX = img.naturalWidth / rect.width;
    const scaleY = img.naturalHeight / rect.height;

    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const canvasX = Math.floor(clickX * scaleX);
    const canvasY = Math.floor(clickY * scaleY);

    const ctx = canvasRef.current.getContext("2d");
    if (ctx) {
      const pixelData = ctx.getImageData(canvasX, canvasY, 1, 1).data;
      const color = `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`;
      setSelectedColor(color);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsSubmitting(true);
    if (file && file.file) {
      const formData = new FormData();
      formData.append("file", file.file);
      formData.append("service", selected);
      formData.append("watermark", watermarkText);

      if (selectedColor) {
        formData.append("color", JSON.stringify(selectedColor));
      } else {
        formData.append("color", "");
      }

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
          {selected === "Image Copywriter" && (
            <div className="flex flex-col justify-center mt-3">
              <h2>Add text for custom watermark</h2>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder="Enter watermark text"
                className="mt-4 p-2 border border-gray-300 rounded"
              />
            </div>
          )}
          {file && (
            <div className="relative flex justify-between items-center mt-8 gap-x-10 border-2 px-5 py-6 shadow-md bg-white rounded-xl">
              <X
                className="absolute right-5 top-5 hover:cursor-pointer hover:text-red-500 active:text-red-700"
                onClick={removeFile}
              />
              <div className="flex justify-center items-center gap-x-5">
                {file ? (
                  <ImageDisplay
                    ref={imageRef}
                    title="Original Image"
                    imageUrl={file.preview}
                    imageName={file.name}
                    onClick={handleImageClick}
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
                      Processing Image...
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

        {isModalOpen && selected === "Color Enhancer" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-6 shadow-xl max-w-3xl w-full mx-4">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Palette className="w-6 h-6 text-blue-500" />
                  <h2 className="text-2xl font-semibold">Color Picker</h2>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="relative group">
                  <canvas ref={canvasRef} className="hidden" />
                  <img
                    ref={imageRef}
                    src={file?.preview}
                    alt="Uploaded"
                    className="w-full h-auto rounded-lg cursor-crosshair hover:brightness-105 transition-all"
                    onClick={handleModalClick}
                  />
                  {/* <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors rounded-lg" /> */}
                </div>

                {selectedColor && (
                  <div className="bg-gray-50 p-4 rounded-xl space-y-4">
                    <h3 className="font-medium text-gray-700">
                      Selected Color
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div
                          className="w-20 h-20 rounded-xl shadow-inner"
                          style={{ backgroundColor: selectedColor }}
                        />
                        <div className="absolute -right-1 -top-1">
                          <div className="bg-white rounded-full p-1 shadow-md">
                            <Check className="w-4 h-4 text-green-500" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="font-mono text-sm bg-gray-100 px-3 py-1 rounded-md">
                          {selectedColor}
                        </p>
                        <p className="text-sm text-gray-500">
                          Click anywhere on the image to select a different
                          color
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Confirm Color
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <RightSidebar />
    </div>
  );
};

export default ImageEditor;
