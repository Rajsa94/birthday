import React, { useRef, useState } from 'react';
import { Upload, X, RefreshCw, Image as ImageIcon, AlertCircle, Check } from 'lucide-react';
import { validateImageFile, readFileAsBase64 } from '../utils/imageDb';

export default function ImageUploader({
  label,
  helperText,
  currentImage,
  onImageChange,
  onImageRemove,
  aspectRatio = 'square', // 'square' | 'banner' | 'card'
}) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setError(null);

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    try {
      setIsProcessing(true);
      const base64Data = await readFileAsBase64(file);
      onImageChange(base64Data);
    } catch (err) {
      setError('Failed to process image file. Please try another image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const aspectClasses = {
    square: 'aspect-square max-w-[200px]',
    banner: 'aspect-[21/9] w-full',
    card: 'aspect-[4/3] w-full max-w-[280px]',
  }[aspectRatio] || 'aspect-square max-w-[200px]';

  return (
    <div className="space-y-2 text-left">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700">
          {label}
        </label>
        {helperText && (
          <span className="text-[11px] text-slate-400">{helperText}</span>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFiles(e.target.files)}
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
      />

      {currentImage ? (
        /* Image Preview Box with Replace & Remove */
        <div className={`relative rounded-2xl overflow-hidden border-2 border-purple-200/80 shadow-md group ${aspectClasses} bg-slate-900`}>
          <img
            src={currentImage}
            alt={label}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Action Overlay */}
          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl bg-white/90 hover:bg-white text-purple-700 font-bold text-xs shadow-md flex items-center gap-1 transition-all"
              title="Replace image"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Replace</span>
            </button>

            {onImageRemove && (
              <button
                type="button"
                onClick={onImageRemove}
                className="p-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md flex items-center gap-1 transition-all"
                title="Remove image"
              >
                <X className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            )}
          </div>

          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] text-white flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-400" />
            <span>Uploaded</span>
          </div>
        </div>
      ) : (
        /* Drag and Drop Upload Area */
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-purple-600 bg-purple-50'
              : 'border-slate-200 hover:border-purple-400 hover:bg-purple-50/40 bg-slate-50/60'
          }`}
        >
          <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
            {isProcessing ? (
              <RefreshCw className="w-6 h-6 animate-spin text-purple-600" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
          </div>

          <div className="text-xs font-bold text-slate-800">
            Click to upload or drag & drop
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            JPG, JPEG, PNG, or WEBP (Max 5 MB)
          </p>
        </div>
      )}

      {error && (
        <p className="text-xs text-rose-600 flex items-center gap-1 font-medium mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
