import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";

interface ImageUploadProps {
  onImageUpload: (file: File | string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onImageUpload(acceptedFiles[0]);
      }
    },
    [onImageUpload]
  );

  const { getRootProps, getInputProps, isDragAccept, isDragReject } =
    useDropzone({
      onDrop,
      accept: { "image/*": [] },
      multiple: false,
    });

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf("image") !== -1) {
            const blob = items[i].getAsFile();
            if (blob) onImageUpload(blob);
          } else if (items[i].type === "text/plain") {
            items[i].getAsString((text) => {
              if (
                text.match(/^(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)$/)
              ) {
                onImageUpload(text);
              }
            });
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [onImageUpload]);

  return (
    <div className="w-full max-w-sm mx-auto">
      <div
        {...getRootProps()}
        className={`relative bg-white rounded-xl shadow-md transition-all duration-300 ease-in-out
          ${
            isDragAccept
              ? "border-green-500"
              : isDragReject
              ? "border-red-500"
              : "border-gray-300"
          }
          ${
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "hover:border-blue-400"
          }
          p-6 cursor-pointer`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center">
          <button className="bg-blue-500 text-white font-semibold py-2 px-10 rounded-xl mb-2 flex items-center tracking-wider">
            <Upload className="mr-2" size={20} />
            Upload Image
          </button>
          <p className="text-xs text-gray-500">or drop a file here</p>
          <p className="text-xs text-gray-400 mt-1">
            CTRL+V to paste image or URL
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
