import React, { useState } from 'react';
import { Upload, Trash2, Plus, Sparkles, Image as ImageIcon, Check, AlertCircle, Edit2 } from 'lucide-react';
import { validateImageFile, readFileAsBase64 } from '../utils/imageDb';

export default function ImageGalleryManager({
  galleryImages = [],
  onUpdateGallery,
}) {
  const [captionInput, setCaptionInput] = useState('');
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingImageId, setEditingImageId] = useState(null);
  const [editCaptionText, setEditCaptionText] = useState('');

  const handleUploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    try {
      setIsProcessing(true);
      const base64Data = await readFileAsBase64(file);
      const newImage = {
        id: Date.now(),
        url: base64Data,
        caption: captionInput.trim() || `Birthday Memory #${(galleryImages.length || 0) + 1}`,
        createdAt: new Date().toISOString(),
      };

      const updated = [...(galleryImages || []), newImage];
      onUpdateGallery(updated);
      setCaptionInput('');
    } catch (err) {
      setError('Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = (id) => {
    const updated = (galleryImages || []).filter(img => img.id !== id);
    onUpdateGallery(updated);
  };

  const handleSaveCaption = (id) => {
    const updated = (galleryImages || []).map(img =>
      img.id === id ? { ...img, caption: editCaptionText.trim() || img.caption } : img
    );
    onUpdateGallery(updated);
    setEditingImageId(null);
  };

  return (
    <div className="space-y-6 text-left max-w-5xl">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center font-bold">
              <ImageIcon className="w-4 h-4" />
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">
              Celebration Photo Gallery
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Upload memories, pre-birthday snapshots, and milestone moments. These appear in an elegant carousel/grid on the public invitation page.
          </p>
        </div>

        <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 shrink-0">
          {(galleryImages || []).length} Photos in Gallery
        </span>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload New Photo Card */}
      <div className="bg-gradient-to-br from-purple-50/70 to-pink-50/60 rounded-3xl p-6 border border-purple-200/80 shadow-sm space-y-4">
        <h3 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2">
          <Upload className="w-4 h-4 text-purple-600" />
          <span>Upload New Gallery Photo</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Photo Caption / Memory Description
            </label>
            <input
              type="text"
              value={captionInput}
              onChange={(e) => setCaptionInput(e.target.value)}
              placeholder="e.g. Friends Trip to Goa or Silver Jubilee Milestone"
              className="w-full px-3.5 py-2.5 rounded-xl border border-purple-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          <div>
            <label className="block w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-600/20 cursor-pointer text-center transition-all flex items-center justify-center gap-2">
              <Upload className="w-4 h-4" />
              <span>{isProcessing ? 'Processing...' : 'Choose Image (Max 5MB)'}</span>
              <input
                type="file"
                onChange={handleUploadImage}
                accept="image/jpeg,image/png,image/webp,image/jpg"
                className="hidden"
                disabled={isProcessing}
              />
            </label>
          </div>
        </div>
      </div>

      {/* Photos Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
        <h3 className="font-serif font-bold text-base text-slate-900 mb-4">
          Current Gallery Images ({(galleryImages || []).length})
        </h3>

        {(galleryImages || []).length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <ImageIcon className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-600">No gallery photos added yet</p>
            <p className="text-xs text-slate-400 mt-1">Upload photos above to display them on the public invitation page.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {galleryImages.map((img, idx) => (
              <div
                key={img.id || idx}
                className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-950 relative">
                  <img
                    src={img.url}
                    alt={img.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={() => handleRemoveImage(img.id)}
                    className="absolute top-2 right-2 p-2 rounded-xl bg-black/60 hover:bg-rose-600 text-white transition-all shadow-md"
                    title="Delete photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                  {editingImageId === img.id ? (
                    <div className="flex items-center gap-1.5 w-full">
                      <input
                        type="text"
                        value={editCaptionText}
                        onChange={(e) => setEditCaptionText(e.target.value)}
                        className="flex-1 px-2 py-1 text-xs border rounded-lg focus:outline-none"
                      />
                      <button
                        onClick={() => handleSaveCaption(img.id)}
                        className="p-1 rounded-md bg-emerald-600 text-white"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="font-semibold text-slate-800 truncate" title={img.caption}>
                        {img.caption || `Photo #${idx + 1}`}
                      </span>
                      <button
                        onClick={() => {
                          setEditingImageId(img.id);
                          setEditCaptionText(img.caption || '');
                        }}
                        className="text-slate-400 hover:text-purple-600 p-1"
                        title="Edit caption"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
