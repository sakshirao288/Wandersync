import React, { useState } from 'react';
import { DiaryEntry, DiaryMood, Language } from '../types/travel';
import { translations } from '../utils/translations';
import { 
  BookHeart, 
  Plus, 
  MapPin, 
  Lock, 
  Globe2, 
  Calendar, 
  Sun, 
  Camera, 
  Sparkles, 
  Trash2, 
  Heart,
  Search
} from 'lucide-react';

interface PersonalDiaryProps {
  entries: DiaryEntry[];
  onAddEntry: (entry: Omit<DiaryEntry, 'id' | 'createdAt'>) => void;
  onDeleteEntry: (entryId: string) => void;
  lang: Language;
}

export const PersonalDiary: React.FC<PersonalDiaryProps> = ({
  entries,
  onAddEntry,
  onDeleteEntry,
  lang,
}) => {
  const t = translations[lang];
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [dayNumber, setDayNumber] = useState(1);
  const [date, setDate] = useState('2026-10-24');
  const [location, setLocation] = useState('Colosseum & Roman Forum, Rome');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<DiaryMood>('inspired');
  const [photoUrl, setPhotoUrl] = useState('/src/assets/images/hero_wander_voyage_1792513873925.jpg');
  const [isPrivate, setIsPrivate] = useState(false);

  const filteredEntries = entries.filter((entry) => {
    const matchesMood = selectedMoodFilter === 'all' || entry.mood === selectedMoodFilter;
    const matchesSearch = entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMood && matchesSearch;
  });

  const getMoodBadge = (mood: DiaryMood) => {
    switch (mood) {
      case 'inspired': return { label: 'Awe-Inspired 🏛️', bg: 'bg-indigo-50 text-indigo-700 border-indigo-100' };
      case 'serene': return { label: 'Peaceful & Serene 🌿', bg: 'bg-emerald-50 text-emerald-700 border-emerald-100' };
      case 'culinary': return { label: 'Culinary Bliss 🍝', bg: 'bg-rose-50 text-rose-700 border-rose-100' };
      case 'energetic': return { label: 'High Energy ⚡', bg: 'bg-amber-50 text-amber-700 border-amber-100' };
      case 'reflective': return { label: 'Sunset Reflection 🌅', bg: 'bg-purple-50 text-purple-700 border-purple-100' };
      default: return { label: 'Explorer', bg: 'bg-slate-50 text-slate-700 border-slate-100' };
    }
  };

  const handleCreateEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onAddEntry({
      title: title.trim(),
      date,
      dayNumber: Number(dayNumber),
      location: location.trim() || 'Rome, Italy',
      content: content.trim(),
      mood,
      weatherSnippet: '23°C · Sunny & Crisp Roman Breeze',
      photoUrl,
      isPrivate,
    });

    setTitle('');
    setContent('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight font-display flex items-center gap-2">
              <BookHeart className="w-5 h-5 text-rose-600" />
              <span>{t.diary.title}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.diary.subtitle}
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 whitespace-nowrap shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{t.diary.newEntry}</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="pt-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            <button
              onClick={() => setSelectedMoodFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedMoodFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Reflections ({entries.length})
            </button>
            <button
              onClick={() => setSelectedMoodFilter('inspired')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedMoodFilter === 'inspired'
                  ? 'bg-slate-900 text-white shadow-xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🏛️ Inspired
            </button>
            <button
              onClick={() => setSelectedMoodFilter('culinary')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedMoodFilter === 'culinary'
                  ? 'bg-slate-900 text-white shadow-xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🍝 Culinary
            </button>
            <button
              onClick={() => setSelectedMoodFilter('serene')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedMoodFilter === 'serene'
                  ? 'bg-slate-900 text-white shadow-xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              🌿 Serene
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search memories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Diary Entries List */}
      <div className="space-y-6">
        {filteredEntries.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
            {t.diary.emptyDiary}
          </div>
        ) : (
          filteredEntries.map((entry) => {
            const moodBadge = getMoodBadge(entry.mood);

            return (
              <article
                key={entry.id}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:border-slate-300 transition-all space-y-4"
              >
                {/* Meta header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      Day {entry.dayNumber}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {entry.date} · {entry.createdAt}
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${moodBadge.bg}`}>
                      {moodBadge.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      {entry.isPrivate ? (
                        <>
                          <Lock className="w-3.5 h-3.5 text-amber-600" />
                          <span className="text-amber-800 font-medium">Private</span>
                        </>
                      ) : (
                        <>
                          <Globe2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-800 font-medium">Shared with Group</span>
                        </>
                      )}
                    </span>

                    <button
                      onClick={() => onDeleteEntry(entry.id)}
                      className="p-1 hover:bg-rose-50 text-slate-300 hover:text-rose-600 rounded transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Entry Title & Location */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    {entry.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      {entry.location}
                    </span>
                    {entry.weatherSnippet && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-slate-600 font-mono text-[11px]">
                          <Sun className="w-3.5 h-3.5 text-amber-500" />
                          {entry.weatherSnippet}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Entry Photo if available */}
                {entry.photoUrl && (
                  <div className="relative aspect-21/9 rounded-xl overflow-hidden bg-slate-100 max-h-64">
                    <img
                      src={entry.photoUrl}
                      alt={entry.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Reflections Text */}
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line font-serif-body">
                  {entry.content}
                </p>
              </article>
            );
          })
        )}
      </div>

      {/* Write Diary Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150 my-8">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {t.diary.newEntry}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Capture your personal thoughts, feelings, and memorable impressions from the road.
            </p>

            <form onSubmit={handleCreateEntry} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  {t.diary.entryTitle} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Walking into the Roman Forum at Sunrise"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Trip Day
                  </label>
                  <select
                    value={dayNumber}
                    onChange={(e) => setDayNumber(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs bg-white font-mono"
                  >
                    <option value={1}>Day 1 (Oct 24)</option>
                    <option value={2}>Day 2 (Oct 25)</option>
                    <option value={3}>Day 3 (Oct 26)</option>
                    <option value={4}>Day 4 (Oct 27)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    {t.diary.moodLabel}
                  </label>
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value as DiaryMood)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs bg-white"
                  >
                    <option value="inspired">Awe-Inspired 🏛️</option>
                    <option value="culinary">Culinary Bliss 🍝</option>
                    <option value="serene">Peaceful &amp; Serene 🌿</option>
                    <option value="energetic">High Energy ⚡</option>
                    <option value="reflective">Sunset Reflection 🌅</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  {t.diary.locationLabel}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Piazza Navona Fountain of Four Rivers"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Attach Visual Memory
                </label>
                <select
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs bg-white"
                >
                  <option value="/src/assets/images/hero_wander_voyage_1792513873925.jpg">Rome Sunset Forum</option>
                  <option value="/src/assets/images/culinary_local_table_1792513875904.jpg">Mediterranean Feast</option>
                  <option value="/src/assets/images/boutique_hotel_suite_1792513875258.jpg">Hotel Piazza Terrace</option>
                  <option value="/src/assets/images/barcelona_gothic_1792513875059.jpg">Medieval Alleyway</option>
                  <option value="/src/assets/images/kyoto_scenic_shrine_1792513874654.jpg">Torii Shrine Path</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  {t.diary.contentLabel} *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write your candid reflections, sensations, smells, acoustic details, and memories..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs resize-none"
                />
              </div>

              {/* Privacy Setting */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">Privacy Control</span>
                  <span className="text-[11px] text-slate-500">
                    {isPrivate ? 'Only visible in your personal diary' : 'Visible to other group travelers'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPrivate(!isPrivate)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                    isPrivate
                      ? 'bg-amber-600 text-white'
                      : 'bg-emerald-700 text-white'
                  }`}
                >
                  {isPrivate ? 'Private' : 'Shared'}
                </button>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg font-medium"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold shadow-xs"
                >
                  Save Reflection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
