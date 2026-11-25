import React, { useState, useEffect } from 'react';
import {
  Save,
  Plus,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Sparkles,
  User,
  Heart,
  Award,
  Briefcase,
  Gift,
  CheckCircle2,
  ExternalLink,
  Sliders,
  Camera,
} from 'lucide-react';
import ImageUploader from './ImageUploader';

export default function DynamicOccasionForm({
  occasion,
  onSaveOccasion,
  onCancel,
}) {
  const [formData, setFormData] = useState({ ...occasion });
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Custom field creation state
  const [newFieldKey, setNewFieldKey] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');

  // Itinerary / Schedule event creation state (for weddings / multi-event)
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventVenue, setNewEventVenue] = useState('');

  // Career milestones state (for retirement)
  const [newMilestoneYear, setNewMilestoneYear] = useState('');
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');

  useEffect(() => {
    setFormData({ ...occasion });
  }, [occasion]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddCustomField = () => {
    if (!newFieldKey.trim()) return;
    const currentCustom = formData.customFields || [];
    setFormData((prev) => ({
      ...prev,
      customFields: [...currentCustom, { label: newFieldKey.trim(), value: newFieldValue.trim() }],
    }));
    setNewFieldKey('');
    setNewFieldValue('');
  };

  const handleRemoveCustomField = (index) => {
    const updated = (formData.customFields || []).filter((_, idx) => idx !== index);
    setFormData((prev) => ({ ...prev, customFields: updated }));
  };

  const handleAddScheduleEvent = () => {
    if (!newEventTitle.trim()) return;
    const currentSchedule = formData.eventSchedule || [];
    setFormData((prev) => ({
      ...prev,
      eventSchedule: [
        ...currentSchedule,
        {
          title: newEventTitle.trim(),
          date: newEventDate || formData.eventDate,
          time: newEventTime || '06:00 PM',
          venue: newEventVenue || formData.venueName,
        },
      ],
    }));
    setNewEventTitle('');
    setNewEventDate('');
    setNewEventTime('');
    setNewEventVenue('');
  };

  const handleRemoveScheduleEvent = (index) => {
    const updated = (formData.eventSchedule || []).filter((_, idx) => idx !== index);
    setFormData((prev) => ({ ...prev, eventSchedule: updated }));
  };

  const handleAddMilestone = () => {
    if (!newMilestoneTitle.trim()) return;
    const current = formData.careerMilestones || [];
    setFormData((prev) => ({
      ...prev,
      careerMilestones: [
        ...current,
        { year: newMilestoneYear.trim() || new Date().getFullYear().toString(), title: newMilestoneTitle.trim() },
      ],
    }));
    setNewMilestoneYear('');
    setNewMilestoneTitle('');
  };

  const handleRemoveMilestone = (index) => {
    const updated = (formData.careerMilestones || []).filter((_, idx) => idx !== index);
    setFormData((prev) => ({ ...prev, careerMilestones: updated }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveOccasion(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const occasionType = formData.occasionType || 'birthday';

  return (
    <div className="space-y-6 text-left max-w-5xl">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-800 via-pink-700 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-gold-200 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-gold-300" />
              <span>Occasion Form Customizer</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight">
              Edit {formData.occasionName}
            </h2>
            <p className="text-xs sm:text-sm text-pink-100 mt-1 max-w-xl">
              Configured dynamically for <strong>{occasionType.toUpperCase()}</strong> with tailored fields, schedules, and custom metadata.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`/invite/${occasionType}/${formData.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-purple-900 font-bold text-xs sm:text-sm hover:bg-pink-50 shadow-md transition-all active:scale-95"
            >
              <span>Preview Live Invitation</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Occasion information saved successfully! All updates reflect live on its public URL.</span>
        </div>
      )}

      {/* Main Dynamic Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Core Settings: Title, Tagline, Seating Toggle */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Sliders className="w-4 h-4 text-purple-600" />
            <span>Event Identification & Display Titles</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Occasion Name (Internal Reference) *
              </label>
              <input
                type="text"
                name="occasionName"
                value={formData.occasionName || ''}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Public Celebration Title / Main Headline *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tagline / Subheading
              </label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline || ''}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>

            <div className="sm:col-span-2 flex items-center justify-between p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100">
              <div>
                <span className="text-xs font-bold text-purple-900 block">
                  Enable Banquet Table Seating for this Occasion
                </span>
                <span className="text-[11px] text-slate-500">
                  Turn off if this is an open festival or gathering that does not need banquet table seat assignments.
                </span>
              </div>
              <input
                type="checkbox"
                name="seatingEnabled"
                checked={formData.seatingEnabled !== false}
                onChange={handleChange}
                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* IMAGE & MEDIA UPLOAD MANAGEMENT */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-slate-900">
                Showcase Media & Image Uploads
              </h3>
              <p className="text-xs text-slate-400">
                Upload images from your computer (JPG, PNG, WEBP, up to 5 MB). Displayed in the Hero Showcase.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Main Profile Photo / Portrait */}
            <div>
              <ImageUploader
                label="Main Profile Photo / Portrait"
                helperText="Primary Showcase Circle Photo"
                currentImage={formData.profileImage}
                onImageChange={(img) => setFormData((prev) => ({ ...prev, profileImage: img }))}
                onImageRemove={() => setFormData((prev) => ({ ...prev, profileImage: '' }))}
                aspectRatio="square"
              />
            </div>

            {/* 2. Custom Centerpiece / Cake Image */}
            <div>
              <ImageUploader
                label="Custom Centerpiece / Cake Graphic"
                helperText="Optional custom photo (replaces default SVG art)"
                currentImage={formData.cakeImage}
                onImageChange={(img) => setFormData((prev) => ({ ...prev, cakeImage: img }))}
                onImageRemove={() => setFormData((prev) => ({ ...prev, cakeImage: '' }))}
                aspectRatio="square"
              />
            </div>

            {/* 3. Invitation Background Image */}
            <div>
              <ImageUploader
                label="Invitation Background Wallpaper"
                helperText="Subtle Background Wallpaper (Optional)"
                currentImage={formData.backgroundImage}
                onImageChange={(img) => setFormData((prev) => ({ ...prev, backgroundImage: img }))}
                onImageRemove={() => setFormData((prev) => ({ ...prev, backgroundImage: '' }))}
                aspectRatio="card"
              />
            </div>

            {/* 4. Partner / Secondary Photo (for weddings, engagements & anniversaries) */}
            {(occasionType === 'wedding' || occasionType === 'anniversary' || occasionType === 'engagement') && (
              <div className="md:col-span-3 pt-3 border-t border-slate-100">
                <ImageUploader
                  label="Groom / Partner Portrait Photo"
                  helperText="Partner Photo for Couple Showcase"
                  currentImage={formData.secondaryImage}
                  onImageChange={(img) => setFormData((prev) => ({ ...prev, secondaryImage: img }))}
                  onImageRemove={() => setFormData((prev) => ({ ...prev, secondaryImage: '' }))}
                  aspectRatio="square"
                />
              </div>
            )}
          </div>
        </div>

        {/* 1. OCCASION-SPECIFIC FIELD SECTIONS */}
        {/* BIRTHDAY SPECIFIC */}
        {occasionType === 'birthday' && (
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <Gift className="w-4 h-4 text-pink-600" />
              <span>Birthday Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Birthday Person Name *
                </label>
                <input
                  type="text"
                  name="personName"
                  value={formData.personName || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Age / Milestone (e.g. 25, 50, Sweet 16)
                </label>
                <input
                  type="text"
                  name="age"
                  value={formData.age || ''}
                  onChange={handleChange}
                  placeholder="e.g. 25"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>
            </div>
          </div>
        )}

        {/* WEDDING SPECIFIC */}
        {occasionType === 'wedding' && (
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-5">
            <h3 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <Heart className="w-4 h-4 text-rose-600" />
              <span>Royal Wedding Couple & Ceremony Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Bride's Full Name *
                </label>
                <input
                  type="text"
                  name="brideName"
                  value={formData.brideName || ''}
                  onChange={handleChange}
                  placeholder="e.g. Ananya Deshmukh"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Groom's Full Name *
                </label>
                <input
                  type="text"
                  name="groomName"
                  value={formData.groomName || ''}
                  onChange={handleChange}
                  placeholder="e.g. Vikramaditya Rathore"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>
            </div>

            {/* Wedding Multi-Event Itinerary / Schedule */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Wedding Events & Rituals Itinerary
                </span>
                <span className="text-[11px] text-slate-400">
                  Mehendi, Haldi, Sangeet, Muhurat, Reception
                </span>
              </div>

              {/* Event items list */}
              <div className="space-y-2">
                {(formData.eventSchedule || []).map((ev, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800"
                  >
                    <div>
                      <strong className="text-sm font-bold text-purple-950 block">{ev.title}</strong>
                      <span className="text-slate-500">{ev.date} • {ev.time} @ {ev.venue}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveScheduleEvent(idx)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add event inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Event (e.g. Sangeet)"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200"
                />
                <input
                  type="date"
                  value={newEventDate}
                  onChange={(e) => setNewEventDate(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200"
                />
                <input
                  type="text"
                  placeholder="Time (e.g. 07:00 PM)"
                  value={newEventTime}
                  onChange={(e) => setNewEventTime(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200"
                />
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="Venue Hall"
                    value={newEventVenue}
                    onChange={(e) => setNewEventVenue(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={handleAddScheduleEvent}
                    className="p-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white"
                    title="Add Event"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RETIREMENT SPECIFIC */}
        {occasionType === 'retirement' && (
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <Award className="w-4 h-4 text-blue-600" />
              <span>Retirement Honor & Career Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Employee / Honoree Name *
                </label>
                <input
                  type="text"
                  name="employeeName"
                  value={formData.employeeName || ''}
                  onChange={handleChange}
                  placeholder="e.g. Dr. Ramesh Kumar Varma"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Designation / Role
                </label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation || ''}
                  onChange={handleChange}
                  placeholder="e.g. Senior Vice President"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Company / Organization
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName || ''}
                  onChange={handleChange}
                  placeholder="e.g. Apollo Healthcare"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>
            </div>

            {/* Career Milestones */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Career Milestones & Achievements
              </span>
              <div className="space-y-2">
                {(formData.careerMilestones || []).map((m, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800"
                  >
                    <span>
                      <strong className="text-blue-700 mr-2 font-bold">{m.year}:</strong>
                      {m.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMilestone(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Year (e.g. 2004)"
                  value={newMilestoneYear}
                  onChange={(e) => setNewMilestoneYear(e.target.value)}
                  className="w-28 px-3 py-2 text-xs rounded-xl border border-slate-200"
                />
                <input
                  type="text"
                  placeholder="Milestone achievement description..."
                  value={newMilestoneTitle}
                  onChange={(e) => setNewMilestoneTitle(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200"
                />
                <button
                  type="button"
                  onClick={handleAddMilestone}
                  className="px-3 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
                >
                  Add Milestone
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DIWALI SPECIFIC */}
        {occasionType === 'diwali' && (
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Diwali Puja & Celebration Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Host Family / Organizers *
                </label>
                <input
                  type="text"
                  name="hostName"
                  value={formData.hostName || ''}
                  onChange={handleChange}
                  placeholder="e.g. The Sharma & Verma Family"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Lakshmi Puja Muhurat Time
                </label>
                <input
                  type="time"
                  name="pujaTime"
                  value={formData.pujaTime || '18:30'}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>
            </div>
          </div>
        )}

        {/* ANNIVERSARY SPECIFIC */}
        {occasionType === 'anniversary' && (
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <Heart className="w-4 h-4 text-pink-600" />
              <span>Anniversary Couple & Milestone</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Couple's Names *
                </label>
                <input
                  type="text"
                  name="coupleNames"
                  value={formData.coupleNames || ''}
                  onChange={handleChange}
                  placeholder="e.g. Priya & Rahul Kapoor"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Anniversary Milestone (e.g. 25th Silver, 50th Golden)
                </label>
                <input
                  type="text"
                  name="anniversaryMilestone"
                  value={formData.anniversaryMilestone || ''}
                  onChange={handleChange}
                  placeholder="e.g. 25th Silver Jubilee"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>
            </div>
          </div>
        )}

        {/* BABY SHOWER SPECIFIC */}
        {occasionType === 'babyshower' && (
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <Gift className="w-4 h-4 text-sky-500" />
              <span>Baby Shower Family & Theme</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Parents' Names *
                </label>
                <input
                  type="text"
                  name="parentsNames"
                  value={formData.parentsNames || ''}
                  onChange={handleChange}
                  placeholder="e.g. Neha & Amit Singhania"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Baby Shower Theme (e.g. Starlight Safari, Cloud Nine)
                </label>
                <input
                  type="text"
                  name="babyTheme"
                  value={formData.babyTheme || ''}
                  onChange={handleChange}
                  placeholder="e.g. Pastel Stars & Teddy Bears"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>
            </div>
          </div>
        )}

        {/* Section 2: Universal Date, Time & Venue */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Calendar className="w-4 h-4 text-amber-600" />
            <span>Event Logistics, Venue & Schedule</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Event Date *
              </label>
              <input
                type="date"
                name="eventDate"
                value={formData.eventDate || ''}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Start Time *
              </label>
              <input
                type="time"
                name="partyStartTime"
                value={formData.partyStartTime || formData.eventTime || '19:00'}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                End Time *
              </label>
              <input
                type="time"
                name="partyEndTime"
                value={formData.partyEndTime || '23:00'}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Venue Name *
              </label>
              <input
                type="text"
                name="venueName"
                value={formData.venueName || ''}
                onChange={handleChange}
                placeholder="e.g. Royal Orchid Banquets"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Host Contact / Helpline *
              </label>
              <input
                type="tel"
                name="hostContact"
                value={formData.hostContact || ''}
                onChange={handleChange}
                placeholder="10-digit mobile"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Complete Venue Address *
              </label>
              <input
                type="text"
                name="venueAddress"
                value={formData.venueAddress || ''}
                onChange={handleChange}
                placeholder="Full address with city..."
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Google Maps Link
              </label>
              <input
                type="url"
                name="googleMapsUrl"
                value={formData.googleMapsUrl || ''}
                onChange={handleChange}
                placeholder="https://maps.google.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Invitation Note / Message from Host *
              </label>
              <textarea
                rows={3}
                name="invitationMessage"
                value={formData.invitationMessage || ''}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Section 3: Custom Fields Builder */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-serif font-bold text-base text-slate-900">
                Custom Fields Builder
              </h3>
              <p className="text-xs text-slate-400">
                Add any extra custom details (e.g. Dress Code, Hashtag, Accommodation Notes, Parking)
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {(formData.customFields || []).map((cf, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-2xl bg-purple-50/50 border border-purple-100 text-xs"
              >
                <div>
                  <strong className="text-purple-900 block font-bold">{cf.label}:</strong>
                  <span className="text-slate-600">{cf.value}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveCustomField(idx)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <input
              type="text"
              placeholder="Field Name (e.g. Event Hashtag, Live Stream Link)"
              value={newFieldKey}
              onChange={(e) => setNewFieldKey(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm"
            />
            <input
              type="text"
              placeholder="Field Value (e.g. #AnanyaWedsVikram)"
              value={newFieldValue}
              onChange={(e) => setNewFieldValue(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm"
            />
            <button
              type="button"
              onClick={handleAddCustomField}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Field</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-700 hover:to-amber-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Occasion Information</span>
          </button>
        </div>
      </form>
    </div>
  );
}
