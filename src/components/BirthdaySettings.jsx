import React, { useState } from 'react';
import {
  Save,
  Eye,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Phone,
  FileText,
  User,
  Palette,
  Image as ImageIcon,
  CheckCircle2,
  ExternalLink,
  Cake,
} from 'lucide-react';
import ImageUploader from './ImageUploader';

const THEME_OPTIONS = [
  { id: 'purple', name: 'Royal Purple & Pink', primary: 'from-purple-600 via-pink-600 to-amber-400', badge: 'bg-purple-600' },
  { id: 'pink', name: 'Festive Rose Glam', primary: 'from-pink-600 via-rose-500 to-amber-300', badge: 'bg-pink-600' },
  { id: 'gold', name: 'Golden Jubilee & Champagne', primary: 'from-amber-500 via-yellow-400 to-amber-700', badge: 'bg-amber-500' },
  { id: 'emerald', name: 'Emerald Velvet Royale', primary: 'from-emerald-600 via-teal-500 to-amber-300', badge: 'bg-emerald-600' },
  { id: 'rose', name: 'Midnight Plum Elegance', primary: 'from-indigo-900 via-purple-700 to-pink-500', badge: 'bg-indigo-800' },
];

export default function BirthdaySettings({
  birthdayDetails,
  onSaveBirthdayDetails,
}) {
  const [formData, setFormData] = useState({
    personName: birthdayDetails.personName || '',
    celebrationTitle: birthdayDetails.celebrationTitle || '',
    tagline: birthdayDetails.tagline || '',
    invitationMessage: birthdayDetails.invitationMessage || '',
    birthdayDate: birthdayDetails.birthdayDate || birthdayDetails.eventDate || '2026-12-18',
    partyStartTime: birthdayDetails.partyStartTime || '19:00',
    partyEndTime: birthdayDetails.partyEndTime || '23:30',
    venueName: birthdayDetails.venueName || '',
    venueAddress: birthdayDetails.venueAddress || '',
    googleMapsUrl: birthdayDetails.googleMapsUrl || '',
    hostContact: birthdayDetails.hostContact || '',
    dressCode: birthdayDetails.dressCode || 'Festive Glam / Cocktail Attire',
    themeColor: birthdayDetails.themeColor || 'purple',
    profileImage: birthdayDetails.profileImage || birthdayDetails.photoUrl || '',
    backgroundImage: birthdayDetails.backgroundImage || '',
    cakeImage: birthdayDetails.cakeImage || '',
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveBirthdayDetails(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 text-left max-w-5xl">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-700 via-pink-600 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-gold-200 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-gold-300" />
              <span>Event Customization Control</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight">
              Birthday Event Settings
            </h2>
            <p className="text-xs sm:text-sm text-pink-100 mt-1 max-w-xl">
              Modify all birthday event metadata, upload real images, change timings, and update venue coordinates without editing source code.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-purple-900 font-bold text-xs sm:text-sm hover:bg-pink-50 shadow-md transition-all active:scale-95"
            >
              <span>Preview Invitation</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Birthday details saved successfully! The public invitation has been updated in real-time.</span>
          </div>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Birthday Person & Title */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-slate-900">
                Birthday Person & Headings
              </h3>
              <p className="text-xs text-slate-400">Personal branding and invitation titles</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Birthday Person Name *
              </label>
              <input
                type="text"
                name="personName"
                value={formData.personName}
                onChange={handleChange}
                placeholder="e.g. Aria Sharma"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Celebration Title / Main Heading *
              </label>
              <input
                type="text"
                name="celebrationTitle"
                value={formData.celebrationTitle}
                onChange={handleChange}
                placeholder="e.g. Aria's 25th Milestone Birthday Bash"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tagline / Subheading
              </label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                placeholder="e.g. A Silver Jubilee Celebration of Elegance, Laughter & Joy"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Invitation Message / Note from Host *
              </label>
              <textarea
                rows={3}
                name="invitationMessage"
                value={formData.invitationMessage}
                onChange={handleChange}
                placeholder="Enter personal message to guests..."
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500 resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Section 2: Image Upload Management (Profile, Background, Cake) */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-sm">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-slate-900">
                Image Upload Management
              </h3>
              <p className="text-xs text-slate-400">
                Upload real photos directly from your computer (JPG, PNG, WEBP, up to 5 MB)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Birthday Person Profile Photo */}
            <div className="space-y-2">
              <ImageUploader
                label="Birthday Person Profile Photo"
                helperText="Avatar / Main Portrait"
                currentImage={formData.profileImage}
                onImageChange={(img) => setFormData((prev) => ({ ...prev, profileImage: img }))}
                onImageRemove={() => setFormData((prev) => ({ ...prev, profileImage: '' }))}
                aspectRatio="square"
              />
            </div>

            {/* Birthday Cake Image */}
            <div className="space-y-2">
              <ImageUploader
                label="Birthday Cake Image / Photo"
                helperText="Custom Cake Illustration or Photo"
                currentImage={formData.cakeImage}
                onImageChange={(img) => setFormData((prev) => ({ ...prev, cakeImage: img }))}
                onImageRemove={() => setFormData((prev) => ({ ...prev, cakeImage: '' }))}
                aspectRatio="square"
              />
            </div>

            {/* Custom Invitation Background Image */}
            <div className="space-y-2">
              <ImageUploader
                label="Invitation Background Image (Optional)"
                helperText="Full Banner / Venue Wallpaper"
                currentImage={formData.backgroundImage}
                onImageChange={(img) => setFormData((prev) => ({ ...prev, backgroundImage: img }))}
                onImageRemove={() => setFormData((prev) => ({ ...prev, backgroundImage: '' }))}
                aspectRatio="card"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Date, Time & Venue */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-slate-900">
                Date, Time & Venue Logistics
              </h3>
              <p className="text-xs text-slate-400">Party schedule, address, and navigation</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Birthday Date *
              </label>
              <input
                type="date"
                name="birthdayDate"
                value={formData.birthdayDate}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Party Start Time *
              </label>
              <input
                type="time"
                name="partyStartTime"
                value={formData.partyStartTime}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Party End Time *
              </label>
              <input
                type="time"
                name="partyEndTime"
                value={formData.partyEndTime}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Venue Name *
              </label>
              <input
                type="text"
                name="venueName"
                value={formData.venueName}
                onChange={handleChange}
                placeholder="e.g. The Grand Crystal Ballroom"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Host Contact / Helpline *
              </label>
              <input
                type="tel"
                name="hostContact"
                value={formData.hostContact}
                onChange={handleChange}
                placeholder="e.g. 9876543210"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Complete Venue Address *
              </label>
              <input
                type="text"
                name="venueAddress"
                value={formData.venueAddress}
                onChange={handleChange}
                placeholder="Full address with landmarks and city..."
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Google Maps Navigation Link
              </label>
              <input
                type="url"
                name="googleMapsUrl"
                value={formData.googleMapsUrl}
                onChange={handleChange}
                placeholder="https://maps.google.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Theme Color & Styling */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-slate-900">
                Theme Color Palette & Dress Code
              </h3>
              <p className="text-xs text-slate-400">Configure visual tones and attire suggestions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Celebration Color Scheme
              </label>
              <div className="grid grid-cols-1 gap-2">
                {THEME_OPTIONS.map((theme) => (
                  <label
                    key={theme.id}
                    className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                      formData.themeColor === theme.id
                        ? 'border-purple-600 bg-purple-50/60 ring-2 ring-purple-400/30'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="themeColor"
                        value={theme.id}
                        checked={formData.themeColor === theme.id}
                        onChange={handleChange}
                        className="text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-xs font-bold text-slate-800">{theme.name}</span>
                    </div>
                    <div className={`w-16 h-4 rounded-full bg-gradient-to-r ${theme.primary}`}></div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Dress Code Recommendation
              </label>
              <input
                type="text"
                name="dressCode"
                value={formData.dressCode}
                onChange={handleChange}
                placeholder="e.g. Festive Glam / Cocktail Attire"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm shadow-sm transition-all"
          >
            <Eye className="w-4 h-4 text-purple-600" />
            <span>Preview Public Invitation</span>
          </a>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-700 hover:to-amber-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-600/30 transition-all transform active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Save & Update Birthday Details</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
