import React, { useState } from 'react';
import { SocialPost, Language } from '../types/travel';
import { translations } from '../utils/translations';
import { 
  Heart, 
  MessageSquare, 
  Bookmark, 
  Share2, 
  Plus, 
  MapPin, 
  Send,
  Compass
} from 'lucide-react';

interface SocialFeedProps {
  posts: SocialPost[];
  onAddPost: (post: Omit<SocialPost, 'id' | 'likes' | 'likedByMe' | 'commentsCount' | 'comments'>) => void;
  onToggleLikePost: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  lang: Language;
}

export const SocialFeed: React.FC<SocialFeedProps> = ({
  posts,
  onAddPost,
  onToggleLikePost,
  onAddComment,
  lang,
}) => {
  const t = translations[lang];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');

  const [newTitle, setNewTitle] = useState('');
  const [newDestination, setNewDestination] = useState('');
  const [newStory, setNewStory] = useState('');
  const [newTags, setNewTags] = useState('#GroupTrip #ItineraryTips');
  const [newImageUrl, setNewImageUrl] = useState('/src/assets/images/hero_wander_voyage_1792513873925.jpg');

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newStory.trim()) return;

    onAddPost({
      author: 'Alex Rivers',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      destination: newDestination.trim() || 'Rome, Italy',
      date: 'Just now',
      title: newTitle.trim(),
      story: newStory.trim(),
      imageUrl: newImageUrl,
      tags: newTags.split(' ').map(tag => tag.trim()).filter(Boolean),
    });

    setNewTitle('');
    setNewDestination('');
    setNewStory('');
    setIsModalOpen(false);
  };

  const handlePostComment = (postId: string) => {
    if (!commentInput.trim()) return;
    onAddComment(postId, commentInput.trim());
    setCommentInput('');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-display">
              {t.social.title}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {t.social.subtitle}
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{t.social.newPost}</span>
          </button>
        </div>
      </div>

      {/* Posts Stream */}
      <div className="space-y-6">
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
          >
            {/* Author info */}
            <div className="p-4 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={post.authorAvatar}
                  alt={post.author}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    {post.author}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>{post.destination}</span>
                    <span>·</span>
                    <span>{post.date}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => alert(`Saved "${post.title}" to your offline travel bookmarks!`)}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
                title="Bookmark story"
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>

            {/* Post image */}
            <div className="relative aspect-16/9 bg-slate-100 overflow-hidden">
              <img
                src={post.imageUrl}
                alt={post.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Post content */}
            <div className="p-5">
              <h4 className="text-lg font-bold text-slate-900 leading-snug mb-2 font-display">
                {post.title}
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                {post.story}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-3">
                {post.tags.map((tag, i) => (
                  <span key={i} className="text-xs text-amber-700 font-medium">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Actions strip */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => onToggleLikePost(post.id)}
                    className={`flex items-center gap-1.5 font-medium transition-colors ${
                      post.likedByMe ? 'text-rose-600 font-bold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.likedByMe ? 'fill-rose-600 text-rose-600' : ''}`} />
                    <span className="font-mono tabular-nums">{post.likes} {t.social.likes}</span>
                  </button>

                  <button
                    onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                    className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-medium transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span className="font-mono tabular-nums">{post.comments.length} {t.social.comments}</span>
                  </button>
                </div>

                <button
                  onClick={() => alert("Copied shareable expedition link to clipboard!")}
                  className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>

              {/* Comments drawer */}
              {activeCommentPostId === post.id && (
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-3 bg-slate-50/70 p-3 rounded-xl">
                  {post.comments.map((comment, cIdx) => (
                    <div key={cIdx} className="text-xs">
                      <span className="font-bold text-slate-900">{comment.user}</span>{' '}
                      <span className="text-slate-600">{comment.text}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{comment.time}</span>
                    </div>
                  ))}

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="Share a tip or ask a question..."
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handlePostComment(post.id);
                      }}
                      className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none"
                    />
                    <button
                      onClick={() => handlePostComment(post.id)}
                      className="p-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Modal: Publish Story */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {t.social.newPost}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Share recommendations, routes, and advice with the global adventurer network.
            </p>

            <form onSubmit={handleCreatePost} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Story Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 3 Unmissable Sunset Spots in Rome"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Destination
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rome, Italy"
                    value={newDestination}
                    onChange={(e) => setNewDestination(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Cover Photo
                  </label>
                  <select
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs bg-white"
                  >
                    <option value="/src/assets/images/hero_wander_voyage_1792513873925.jpg">Rome Sunset</option>
                    <option value="/src/assets/images/culinary_local_table_1792513875904.jpg">Mediterranean Dining</option>
                    <option value="/src/assets/images/barcelona_gothic_1792513875059.jpg">Gothic Quarter</option>
                    <option value="/src/assets/images/kyoto_scenic_shrine_1792513874654.jpg">Kyoto Torii Shrine</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Your Story & Recommendations *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your journey, hidden gems, pitfalls to avoid..."
                  value={newStory}
                  onChange={(e) => setNewStory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs resize-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Hashtags
                </label>
                <input
                  type="text"
                  placeholder="#SoloTravel #Rome #Foodie"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs"
                />
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
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium shadow-xs"
                >
                  Publish Story
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
