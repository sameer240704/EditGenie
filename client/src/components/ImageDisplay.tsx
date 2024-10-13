import React, { useEffect, useState } from "react";

interface ImageDisplayProps {
  title: string;
  imageUrl: string;
  imageName?: string;
  animate?: boolean;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({
  title,
  imageUrl,
  imageName,
  animate = false,
}) => {
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsRevealed(true), 1000);
    return () => clearTimeout(timer);
  }, [imageUrl]);

  return (
    <div className="flex flex-col items-center">
      <h2 className="mb-2 font-bold tracking-tighter">{title}</h2>
      <div className="w-96 h-96 p-4 relative overflow-hidden">
        <div
          className={`absolute inset-0 ${
            animate ? "bg-gray-200" : ""
          } transition-transform duration-1000 ease-in-out`}
          style={{
            transform:
              animate && isRevealed ? "translateY(100%)" : "translateY(0)",
          }}
        />
        <img
          src={imageUrl}
          alt={imageName || title}
          className={`w-full h-full object-contain rounded transition-opacity duration-1000 ease-in-out`}
        />
      </div>
    </div>
  );
};

export default ImageDisplay;
