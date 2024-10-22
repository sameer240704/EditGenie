import React, { useRef, useState } from 'react';

const ColorEnhancement = () => {
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [enhancementFactor, setEnhancementFactor] = useState(1.5);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setEnhancedImage(null); // Reset enhanced image when new image is uploaded
    }
  };

  const handleColorPick = () => {
    // Placeholder for color selection
    // In a real implementation, you'd integrate with a color picker
    const color = [255, 0, 0]; // Example red color
    setSelectedColor(color);
  };

  const handleEnhance = async () => {
    if (!selectedImage || !selectedColor) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', fileInputRef.current.files[0]);
      formData.append('color', JSON.stringify(selectedColor));
      formData.append('enhancement_factor', enhancementFactor.toString());

      const response = await fetch('/api/enhance-color', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Enhancement failed');
      }

      const data = await response.json();
      setEnhancedImage(data.image_url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const adjustEnhancementFactor = (increment) => {
    setEnhancementFactor(prev => {
      const newValue = increment ? prev + 0.1 : prev - 0.1;
      return Math.min(Math.max(newValue, 1.0), 3.0);
    });
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="mb-2 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>

      <div className="flex gap-4 mb-4">
        <div className="w-1/2 border rounded-lg overflow-hidden">
          {selectedImage ? (
            <img src={selectedImage} alt="Original" className="max-w-full h-auto" />
          ) : (
            <div className="h-64 bg-gray-100 flex items-center justify-center text-gray-500">
              Upload an image to start
            </div>
          )}
        </div>
        <div className="w-1/2 border rounded-lg overflow-hidden">
          {enhancedImage ? (
            <img src={enhancedImage} alt="Enhanced" className="max-w-full h-auto" />
          ) : (
            <div className="h-64 bg-gray-100 flex items-center justify-center text-gray-500">
              Enhanced image will appear here
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4 items-center mb-4">
        <button
          onClick={handleColorPick}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Pick Color
        </button>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => adjustEnhancementFactor(false)}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            -
          </button>
          <span className="min-w-[120px] text-center">
            Enhancement: {enhancementFactor.toFixed(1)}
          </span>
          <button
            onClick={() => adjustEnhancementFactor(true)}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            +
          </button>
        </div>

        <button
          onClick={handleEnhance}
          disabled={!selectedImage || !selectedColor || loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors
                     disabled:bg-gray-400 disabled:hover:bg-gray-400"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Enhancing...
            </span>
          ) : (
            'Enhance'
          )}
        </button>
      </div>

      {error && (
        <div className="text-red-500 mt-2">
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default ColorEnhancement;