import React from 'react';
import { Calendar, ChevronDown, Sparkles, ExternalLink, Copy, Check } from 'lucide-react';
import { OCCASIONS_CATALOG } from '../data/occasionsCatalog';

export default function OccasionContextBar({
  occasions = [],
  activeOccasionId,
  onSelectOccasion,
  onOpenCreateOccasion,
}) {
  const currentOccasion = occasions.find(o => String(o.id) === String(activeOccasionId)) || occasions[0];
  const catalogItem = currentOccasion
    ? OCCASIONS_CATALOG.find(c => c.id === currentOccasion.occasionType) || OCCASIONS_CATALOG[0]
    : OCCASIONS_CATALOG[0];

  const [copied, setCopied] = React.useState(false);

  const handleCopyLink = () => {
    if (!currentOccasion) return;
    const url = `${window.location.origin}/invite/${currentOccasion.occasionType}/${currentOccasion.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!currentOccasion) return null;

  return (
    <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
      {/* Active Occasion Switcher Dropdown */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-xl shadow-inner shrink-0">
          {catalogItem.emoji}
        </div>

        <div className="flex-1 min-w-[200px]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">
            Active Occasion Context
          </span>
          <div className="relative inline-block w-full">
            <select
              value={activeOccasionId}
              onChange={(e) => onSelectOccasion(e.target.value)}
              className="w-full font-serif font-bold text-sm sm:text-base text-slate-900 bg-transparent pr-7 focus:outline-none cursor-pointer truncate"
            >
              {occasions.map((occ) => (
                <option key={occ.id} value={occ.id}>
                  {occ.occasionName} ({occ.occasionType.toUpperCase()})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Quick context action links */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        <button
          onClick={handleCopyLink}
          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-all"
          title="Copy Invitation Link"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
          <span>{copied ? 'Copied' : 'Copy Link'}</span>
        </button>

        <a
          href={`/invite/${currentOccasion.occasionType}/${currentOccasion.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-xs font-bold text-purple-700 flex items-center gap-1.5 transition-all"
        >
          <span>Preview Live</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
