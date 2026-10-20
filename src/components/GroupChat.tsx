import React, { useState } from 'react';
import { ChatMessage, GroupMember, Language } from '../types/travel';
import { translations } from '../utils/translations';
import { 
  Send, 
  MapPin, 
  BarChart2, 
  Users, 
  Check, 
  Smile, 
  Radio
} from 'lucide-react';

interface GroupChatProps {
  messages: ChatMessage[];
  members: GroupMember[];
  currentUser: GroupMember;
  onSendMessage: (text: string, options?: { isLocation?: boolean; poll?: ChatMessage['poll'] }) => void;
  onVotePoll: (messageId: string, optionIndex: number) => void;
  onLocateOnMap?: (lat: number, lng: number) => void;
  lang: Language;
}

export const GroupChat: React.FC<GroupChatProps> = ({
  messages,
  members,
  currentUser,
  onSendMessage,
  onVotePoll,
  onLocateOnMap,
  lang,
}) => {
  const t = translations[lang];
  const [inputText, setInputText] = useState('');
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOpt1, setPollOpt1] = useState('');
  const [pollOpt2, setPollOpt2] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleSharePin = () => {
    onSendMessage("📍 Shared my live location near the Pantheon, Rome", {
      isLocation: true,
    });
  };

  const handleCreatePoll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pollQuestion.trim() || !pollOpt1.trim() || !pollOpt2.trim()) return;

    onSendMessage(`📊 Group Vote: ${pollQuestion}`, {
      poll: {
        question: pollQuestion.trim(),
        options: [
          { text: pollOpt1.trim(), votes: 0, votedBy: [] },
          { text: pollOpt2.trim(), votes: 0, votedBy: [] },
        ]
      }
    });

    setPollQuestion('');
    setPollOpt1('');
    setPollOpt2('');
    setShowPollCreator(false);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[650px]">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>{t.chat.title}</span>
            <span className="text-xs text-slate-500 font-normal">· Rome Grand Tour</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {members.length} Active Expedition Travelers
          </p>
        </div>

        {/* Member Avatars Strip */}
        <div className="flex items-center -space-x-2">
          {members.map((m) => (
            <img
              key={m.id}
              src={m.avatar}
              alt={m.name}
              title={`${m.name} (${m.role})`}
              className="w-7 h-7 rounded-full object-cover border-2 border-white shadow-xs"
            />
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;

          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[85%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <img
                src={msg.senderAvatar}
                alt={msg.senderName}
                className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
              />

              <div className={`space-y-1 ${isMe ? 'text-right' : ''}`}>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-semibold text-slate-700">{msg.senderName}</span>
                  <span>·</span>
                  <span className="font-mono text-[11px]">{msg.timestamp}</span>
                </div>

                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    isMe
                      ? 'bg-slate-900 text-white rounded-tr-xs'
                      : 'bg-slate-100 text-slate-800 rounded-tl-xs'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Location Attachment */}
                  {msg.isLocation && (
                    <div className="mt-2 pt-2 border-t border-slate-200/40 flex items-center gap-2 text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>Coordinates: 41.8902° N, 12.4922° E</span>
                    </div>
                  )}

                  {/* Interactive Poll */}
                  {msg.poll && (
                    <div className="mt-3 pt-3 border-t border-slate-200/30 space-y-2">
                      <p className="font-bold text-xs">{msg.poll.question}</p>
                      <div className="space-y-1.5">
                        {msg.poll.options.map((opt, optIdx) => {
                          const hasVoted = opt.votedBy.includes(currentUser.id);
                          return (
                            <button
                              key={optIdx}
                              onClick={() => onVotePoll(msg.id, optIdx)}
                              className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                                hasVoted
                                  ? 'bg-amber-600 text-white font-semibold'
                                  : isMe
                                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                                  : 'bg-white hover:bg-slate-200 text-slate-800'
                              }`}
                            >
                              <span>{opt.text}</span>
                              <span className="font-mono tabular-nums text-[11px]">
                                {opt.votes} votes
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Bar (Location Pin / Poll) */}
      <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 flex items-center gap-2 text-xs">
        <button
          type="button"
          onClick={handleSharePin}
          className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-md flex items-center gap-1 transition-colors"
        >
          <MapPin className="w-3.5 h-3.5 text-amber-600" />
          <span>{t.chat.shareLocation}</span>
        </button>

        <button
          type="button"
          onClick={() => setShowPollCreator(!showPollCreator)}
          className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-md flex items-center gap-1 transition-colors"
        >
          <BarChart2 className="w-3.5 h-3.5 text-indigo-600" />
          <span>{t.chat.createPoll}</span>
        </button>
      </div>

      {/* Poll Creator Drawer */}
      {showPollCreator && (
        <form onSubmit={handleCreatePoll} className="p-3 bg-amber-50/70 border-t border-amber-200 space-y-2 text-xs">
          <input
            type="text"
            required
            placeholder="Poll question (e.g. Which museum tomorrow?)"
            value={pollQuestion}
            onChange={(e) => setPollQuestion(e.target.value)}
            className="w-full px-2.5 py-1.5 border border-amber-200 rounded-md bg-white focus:outline-none"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              required
              placeholder="Option 1"
              value={pollOpt1}
              onChange={(e) => setPollOpt1(e.target.value)}
              className="px-2.5 py-1.5 border border-amber-200 rounded-md bg-white focus:outline-none"
            />
            <input
              type="text"
              required
              placeholder="Option 2"
              value={pollOpt2}
              onChange={(e) => setPollOpt2(e.target.value)}
              className="px-2.5 py-1.5 border border-amber-200 rounded-md bg-white focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowPollCreator(false)}
              className="px-3 py-1 bg-white border border-slate-200 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-md font-semibold"
            >
              Post Poll
            </button>
          </div>
        </form>
      )}

      {/* Message Input Bar */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
        <input
          type="text"
          placeholder={t.chat.typePlaceholder}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
        />
        <button
          type="submit"
          className="p-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
