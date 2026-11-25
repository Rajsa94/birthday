import React, { useState } from 'react';
import { Palette, Check, Sparkles, RefreshCw, Upload, Eye, Image as ImageIcon, Type, Sliders, CheckCircle2 } from 'lucide-react';
import { THEMES_CATALOG, getThemeById } from '../themes/themeCatalog';
import ImageUploader from './ImageUploader';

const FONT_OPTIONS = [
  { id: 'playfair', name: 'Playfair Display (Royal Serif)', style: '"Playfair Display", serif' },
  { id: 'cinzel', name: 'Cinzel (Classical Palatial)', style: '"Cinzel", "Playfair Display", serif' },
  { id: 'outfit', name: 'Outfit (Modern Clean Sans)', style: '"Outfit", sans-serif' },
  { id: 'greatvibes', name: 'Great Vibes (Cursive Calligraphy)', style: '"Great Vibes", cursive' },
];

export default function ThemeDesigner({
  currentOccasion,
  onSaveThemeSettings,
}) {
  const activeThemeId = currentOccasion.themeId || 'birthday-purple-pink';
  const baseTheme = getThemeById(activeThemeId, currentOccasion.occasionType);

  // Editable theme state
  const [selectedThemeId, setSelectedThemeId] = useState(activeThemeId);
  const [primaryColor, setPrimaryColor] = useState(
    currentOccasion.customTheme?.primaryColor || baseTheme.colors.primary
  );
  const [secondaryColor, setSecondaryColor] = useState(
    currentOccasion.customTheme?.secondaryColor || baseTheme.colors.secondary
  );
  const [accentColor, setAccentColor] = useState(
    currentOccasion.customTheme?.accentColor || baseTheme.colors.accent
  );
  const [selectedFont, setSelectedFont] = useState(
    currentOccasion.customTheme?.font || 'playfair'
  );
  const [animationsEnabled, setAnimationsEnabled] = useState(
    currentOccasion.customTheme?.animationsEnabled !== undefined
      ? currentOccasion.customTheme.animationsEnabled
      : true
  );
  const [backgroundImage, setBackgroundImage] = useState(
    currentOccasion.backgroundImage || ''
  );
  const [heroImage, setHeroImage] = useState(
    currentOccasion.heroImage || currentOccasion.profileImage || ''
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  // When admin selects a predefined theme, update form values
  const handleSelectPredefinedTheme = (theme) => {
    setSelectedThemeId(theme.id);
    setPrimaryColor(theme.colors.primary);
    setSecondaryColor(theme.colors.secondary);
    setAccentColor(theme.colors.accent);
  };

  const handleSaveTheme = (e) => {
    e.preventDefault();
    const updatedThemeData = {
      themeId: selectedThemeId,
      backgroundImage,
      heroImage,
      customTheme: {
        primaryColor,
        secondaryColor,
        accentColor,
        font: selectedFont,
        animationsEnabled,
      },
    };

    onSaveThemeSettings(updatedThemeData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4500);
  };

  const handleResetToDefault = () => {
    const defaultTheme = getThemeById(null, currentOccasion.occasionType);
    setSelectedThemeId(defaultTheme.id);
    setPrimaryColor(defaultTheme.colors.primary);
    setSecondaryColor(defaultTheme.colors.secondary);
    setAccentColor(defaultTheme.colors.accent);
    setSelectedFont('playfair');
    setAnimationsEnabled(true);
    setBackgroundImage('');
    setHeroImage('');
  };

  // Filter themes suitable for current occasion or all themes
  const relevantThemes = THEMES_CATALOG.filter(
    t => t.occasionType === currentOccasion.occasionType
  );
  const otherThemes = THEMES_CATALOG.filter(
    t => t.occasionType !== currentOccasion.occasionType
  );

  return (
    <div className="space-y-6 text-left max-w-6xl">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-800 via-pink-700 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-gold-200 text-xs font-bold uppercase tracking-wider mb-2">
              <Palette className="w-3.5 h-3.5 text-gold-300" />
              <span>Dynamic Theme Engine & Customizer</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight">
              Theme Designer: {currentOccasion.occasionName}
            </h2>
            <p className="text-xs sm:text-sm text-pink-100 mt-1 max-w-2xl">
              Customize colors, floating animations, typography, backgrounds, and decorative elements. All changes instantly transform the public invitation page.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset to Default</span>
            </button>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Theme customized and applied successfully! The public invitation now uses your bespoke aesthetic.</span>
        </div>
      )}

      {/* Main Designer Grid */}
      <form onSubmit={handleSaveTheme} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Controls & Predefined Themes */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Predefined Themes Carousel / Grid */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <h3 className="font-serif font-bold text-base text-slate-900">
                  Predefined Theme Templates
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                Tuned for {currentOccasion.occasionType.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[...relevantThemes, ...otherThemes].slice(0, 8).map((theme) => {
                const isSelected = selectedThemeId === theme.id;
                return (
                  <div
                    key={theme.id}
                    onClick={() => handleSelectPredefinedTheme(theme)}
                    className={`relative rounded-2xl p-4 border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50/70 ring-2 ring-purple-400/30 shadow-md'
                        : 'border-slate-200 hover:border-purple-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs text-slate-800">{theme.name}</span>
                      {isSelected ? (
                        <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 uppercase font-bold">
                          {theme.occasionType}
                        </span>
                      )}
                    </div>

                    {/* Gradient color preview bar */}
                    <div
                      className={`h-4 rounded-full w-full bg-gradient-to-r ${theme.colors.buttonGradient} shadow-inner mb-2`}
                    ></div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Decor: {theme.decorations.type}</span>
                      <span>Hero: {theme.heroGraphic}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Color Palettes & Fonts Customizer */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Sliders className="w-4 h-4 text-pink-600" />
              <h3 className="font-serif font-bold text-base text-slate-900">
                Custom Palette & Typography
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Primary Color */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Primary Accent Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 p-0.5"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase font-bold"
                  />
                </div>
              </div>

              {/* Secondary Color */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Secondary Gradient Tone
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 p-0.5"
                  />
                  <input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase font-bold"
                  />
                </div>
              </div>

              {/* Accent / Gold Color */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Festive Highlight / Gold
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 p-0.5"
                  />
                  <input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Font Family */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Typography Style
                </label>
                <select
                  value={selectedFont}
                  onChange={(e) => setSelectedFont(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-purple-200"
                >
                  {FONT_OPTIONS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Animation Toggle */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Floating Celebratory Animations
                </label>
                <div className="flex items-center gap-3 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={animationsEnabled}
                      onChange={(e) => setAnimationsEnabled(e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-xs font-bold text-slate-800">
                      Enable floating elements (balloons, petals, diyas, sparkles)
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Background and Hero Media */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <ImageIcon className="w-4 h-4 text-amber-600" />
              <h3 className="font-serif font-bold text-base text-slate-900">
                Occasion Theme Wallpapers & Hero Art
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <ImageUploader
                label="Custom Background Wallpaper"
                helperText="Subtle festive backdrop"
                currentImage={backgroundImage}
                onImageChange={setBackgroundImage}
                onImageRemove={() => setBackgroundImage('')}
                aspectRatio="card"
              />

              <ImageUploader
                label="Main Hero Showcase Art"
                helperText="Centerpiece image or portrait"
                currentImage={heroImage}
                onImageChange={setHeroImage}
                onImageRemove={() => setHeroImage('')}
                aspectRatio="square"
              />
            </div>
          </div>
        </div>

        {/* Right Col: Live Theme Visual Preview */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl text-white text-center sticky top-20 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-purple-400" /> Live Preview
              </span>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                {currentOccasion.occasionType.toUpperCase()}
              </span>
            </div>

            {/* Mini Simulated Invitation Screen */}
            <div
              className="rounded-2xl p-5 border text-center relative overflow-hidden transition-all duration-300"
              style={{
                background: `linear-gradient(135deg, ${secondaryColor}dd 0%, #090d16 60%, ${primaryColor}dd 100%)`,
                borderColor: primaryColor,
              }}
            >
              {/* Mini Ribbon */}
              <div
                className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-2 shadow-xs"
                style={{ backgroundColor: `${primaryColor}40`, color: accentColor }}
              >
                ★ {baseTheme.bannerTag || currentOccasion.occasionName} ★
              </div>

              <h4
                className="text-lg font-bold drop-shadow leading-tight"
                style={{ color: '#ffffff' }}
              >
                {currentOccasion.title || currentOccasion.occasionName}
              </h4>

              <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                {currentOccasion.tagline || currentOccasion.invitationMessage}
              </p>

              {/* Sample Mini Centerpiece */}
              <div className="my-3 flex justify-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl border shadow-lg"
                  style={{
                    backgroundColor: `${accentColor}30`,
                    borderColor: accentColor,
                  }}
                >
                  {baseTheme.heroGraphic === 'diya' && '🪔'}
                  {baseTheme.heroGraphic === 'mandap' && '💍'}
                  {baseTheme.heroGraphic === 'rings' && '🥂'}
                  {baseTheme.heroGraphic === 'plaque' && '🏆'}
                  {baseTheme.heroGraphic === 'baby' && '🍼'}
                  {baseTheme.heroGraphic === 'colorSplash' && '🎨'}
                  {baseTheme.heroGraphic === 'cake' && '🎂'}
                  {baseTheme.heroGraphic === 'champagne' && '🎉'}
                </div>
              </div>

              {/* Sample Mini Button */}
              <div
                className="py-2 px-4 rounded-xl text-xs font-bold text-white shadow-md inline-block"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor}, ${accentColor})`,
                }}
              >
                RSVP Now
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl font-bold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-700 hover:to-amber-600 shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Apply & Save Theme</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
