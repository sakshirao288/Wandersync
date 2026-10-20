import React, { useState } from 'react';
import { GalleryPhoto, GroupMember, Language } from '../types/travel';
import { translations } from '../utils/translations';
import { 
  Camera, 
  Heart, 
  MapPin, 
  Download, 
  Plus, 
  X, 
  User, 
  Sparkles 
} from 'lucide-react';

interface PhotoGalleryProps {
  photos: GalleryPhoto[];
  members: GroupMember[];
  currentUser: GroupMember;
  onAddPhoto: (photo: Omit<GalleryPhoto, 'id' | 'likes' | 'likedByMe'>) => void;
  onToggleLike: (photoId: string) => void;
  lang: Language;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  photos,
  members,
  currentUser,
  onAddPhoto,
  onToggleLike,
  lang,
}) => {
  const t = translations[lang];
  const [selectedMemberFilter, setSelectedMemberFilter] = useState<string>('all');
  const [lightboxPhoto, setLightboxPhoto] = useState<GalleryPhoto | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [newCaption, setNewCaption] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('/src/assets/images/hero_wander_voyage_1792513873925.jpg');

  const filteredPhotos = selectedMemberFilter === 'all'
    ? photos
    : photos.filter(p => p.uploaderId === selectedMemberFilter);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaption.trim()) return;

    onAddPhoto({
      uploaderId: currentUser.id,
      uploaderName: currentUser.name,
      uploaderAvatar: currentUser.avatar,
      imageUrl: newImageUrl,
      caption: newCaption.trim(),
      location: newLocation.trim() || 'Rome, Italy',
      date: 'Just now',
    });

    setNewCaption('');
    setNewLocation('');
    setIsUploadOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-display">
              {t.gallery.title}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {t.gallery.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsUploadOpen(true)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
            >
              <Camera className="w-4 h-4" />
              <span>{t.gallery.uploadPhoto}</span>
            </button>

            <button
              onClick={() => {
                alert("Downloading all 42 high-resolution expedition photos as a .ZIP archive...");
              }}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>{t.gallery.downloadAll}</span>
            </button>
          </div>
        </div>

        {/* Member filter tabs */}
        <div className="flex items-center gap-2 pt-4 overflow-x-auto">
          <button
            onClick={() => setSelectedMemberFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              selectedMemberFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Shared Moments ({photos.length})
          </button>
          {members.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMemberFilter(m.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                selectedMemberFilter === m.id
                  ? 'bg-slate-900 text-white shadow-xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <img src={m.avatar} alt={m.name} className="w-4 h-4 rounded-full object-cover" />
              <span>{m.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Photos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => setLightboxPhoto(photo)}
            className="group relative bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs cursor-pointer hover:shadow-md transition-all flex flex-col"
          >
            <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
              <img
                src={photo.imageUrl}
                alt={photo.caption}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 text-white">
                <span className="text-xs truncate">{photo.caption}</span>
              </div>
            </div>

            <div className="p-3.5 flex flex-col justify-between flex-1">
              <div>
                <p className="text-xs font-medium text-slate-800 line-clamp-2">
                  {photo.caption}
                </p>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{photo.location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-1.5">
                  <img
                    src={photo.uploaderAvatar}
                    alt={photo.uploaderName}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span className="text-[11px] text-slate-600 truncate max-w-[90px]">
                    {photo.uploaderName}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleLike(photo.id);
                  }}
                  className={`flex items-center gap-1 text-xs font-mono tabular-nums transition-colors ${
                    photo.likedByMe ? 'text-rose-600 font-bold' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${photo.likedByMe ? 'fill-rose-600 text-rose-600' : ''}`} />
                  <span>{photo.likes}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxPhoto && (
        <div
          onClick={() => setLightboxPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl overflow-hidden max-w-3xl w-full shadow-2xl animate-in zoom-in-95 duration-150"
          >
            <div className="relative aspect-16/9 bg-black">
              <img
                src={lightboxPhoto.imageUrl}
                alt={lightboxPhoto.caption}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => setLightboxPhoto(null)}
                className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {lightboxPhoto.caption}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    {lightboxPhoto.location}
                  </span>
                  <span>·</span>
                  <span>Captured by {lightboxPhoto.uploaderName}</span>
                  <span>·</span>
                  <span>{lightboxPhoto.date}</span>
                </div>
              </div>

              <button
                onClick={() => onToggleLike(lightboxPhoto.id)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  lightboxPhoto.likedByMe
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Heart className={`w-4 h-4 ${lightboxPhoto.likedByMe ? 'fill-rose-600' : ''}`} />
                <span>{lightboxPhoto.likes} Likes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Memory Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {t.gallery.uploadPhoto}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Add a shot to the collaborative trip gallery for all members to see.
            </p>

            <form onSubmit={handleUpload} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Select Visual Snapshot
                </label>
                <select
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs bg-white"
                >
                  <option value="/src/assets/images/hero_wander_voyage_1792513873925.jpg">Rome Sunset Overlooking Forum</option>
                  <option value="/src/assets/images/culinary_local_table_1792513875904.jpg">Mediterranean Artisan Patio Table</option>
                  <option value="/src/assets/images/boutique_hotel_suite_1792513875258.jpg">Boutique Hotel Balcony View</option>
                  <option value="/src/assets/images/barcelona_gothic_1792513875059.jpg">Gothic Cobblestone Alleyway</option>
                  <option value="/src/assets/images/kyoto_scenic_shrine_1792513874654.jpg">Kyoto Torii Shrine Pathway</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Caption / Memory Story *
                </label>
                <input
                  type="text"
                  required
                  placeholder={t.gallery.captionPlaceholder}
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Landmark / Location Tag
                </label>
                <input
                  type="text"
                  placeholder={t.gallery.locationPlaceholder}
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg font-medium"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium shadow-xs"
                >
                  Publish to Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
