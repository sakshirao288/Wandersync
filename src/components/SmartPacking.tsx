import React, { useState } from 'react';
import { PackingItem, PackingCategory, GroupMember, Language } from '../types/travel';
import { translations } from '../utils/translations';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  CloudRain, 
  Users, 
  Sparkles, 
  Trash2, 
  Luggage,
  Shield,
  Shirt,
  Plug,
  Sun,
  Package
} from 'lucide-react';

interface SmartPackingProps {
  items: PackingItem[];
  members: GroupMember[];
  onTogglePacked: (itemId: string) => void;
  onAddItem: (item: Omit<PackingItem, 'id'>) => void;
  onDeleteItem: (itemId: string) => void;
  onAssignItem: (itemId: string, memberId: string | undefined) => void;
  lang: Language;
}

export const SmartPacking: React.FC<SmartPackingProps> = ({
  items,
  members,
  onTogglePacked,
  onAddItem,
  onDeleteItem,
  onAssignItem,
  lang,
}) => {
  const t = translations[lang];
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<PackingCategory>('essentials');
  const [newItemAssigned, setNewItemAssigned] = useState<string>('');
  const [newItemNotes, setNewItemNotes] = useState('');

  const totalItems = items.length;
  const packedCount = items.filter(i => i.packed).length;
  const percentPacked = totalItems > 0 ? Math.round((packedCount / totalItems) * 100) : 0;

  const filteredItems = items.filter((item) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'weather') return item.weatherTriggered;
    return item.category === activeCategory;
  });

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    onAddItem({
      name: newItemName.trim(),
      category: newItemCategory,
      assignedToId: newItemAssigned || undefined,
      packed: false,
      weatherTriggered: newItemCategory === 'weather',
      notes: newItemNotes.trim(),
    });

    setNewItemName('');
    setNewItemNotes('');
    setIsAddModalOpen(false);
  };

  const getCategoryIcon = (cat: PackingCategory) => {
    switch (cat) {
      case 'essentials': return <Shield className="w-3.5 h-3.5 text-indigo-600" />;
      case 'clothing': return <Shirt className="w-3.5 h-3.5 text-emerald-600" />;
      case 'electronics': return <Plug className="w-3.5 h-3.5 text-amber-600" />;
      case 'weather': return <CloudRain className="w-3.5 h-3.5 text-sky-600" />;
      case 'group': return <Package className="w-3.5 h-3.5 text-rose-600" />;
      default: return <Luggage className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Packing Progress */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight font-display flex items-center gap-2">
              <Luggage className="w-5 h-5 text-amber-600" />
              <span>{t.packing.title}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t.packing.subtitle}
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 whitespace-nowrap shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{t.packing.addItem}</span>
          </button>
        </div>

        {/* Packing Progress Meter */}
        <div className="pt-5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700">
              {t.packing.packedProgress}: {packedCount} of {totalItems} items ready
            </span>
            <span className="font-mono font-bold text-slate-900 tabular-nums">
              {percentPacked}%
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${percentPacked === 100 ? 'bg-emerald-600' : 'bg-amber-600'}`}
              style={{ width: `${percentPacked}%` }}
            />
          </div>
        </div>

        {/* Dynamic Weather Alert Trigger Card */}
        <div className="mt-5 p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-amber-900 block">
              {t.packing.weatherAlertHeader}
            </span>
            <p className="text-amber-800 leading-relaxed">
              {t.packing.weatherAlertDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Category Segmented Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { id: 'all', label: t.packing.allCategories },
          { id: 'weather', label: t.packing.weatherGear },
          { id: 'group', label: t.packing.groupGear },
          { id: 'essentials', label: t.packing.essentials },
          { id: 'clothing', label: t.packing.clothing },
          { id: 'electronics', label: t.packing.electronics },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeCategory === tab.id
                ? 'bg-slate-900 text-white shadow-xs font-semibold'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Packing Checklist Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filteredItems.map((item) => {
            const assignedMember = members.find(m => m.id === item.assignedToId);

            return (
              <div
                key={item.id}
                className={`p-3.5 sm:p-4 flex items-start justify-between gap-3 transition-colors ${
                  item.packed ? 'bg-slate-50/50' : 'hover:bg-slate-50/80'
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => onTogglePacked(item.id)}
                    className="mt-0.5 text-slate-400 hover:text-slate-900 transition-colors shrink-0"
                  >
                    {item.packed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-xs font-bold leading-snug ${item.packed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {item.name}
                      </span>
                      {item.weatherTriggered && (
                        <span className="text-[10px] bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded font-semibold flex items-center gap-1 border border-sky-100">
                          <CloudRain className="w-3 h-3" />
                          <span>Weather Sync</span>
                        </span>
                      )}
                    </div>

                    {item.notes && (
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {item.notes}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                      <span className="flex items-center gap-1 capitalize">
                        {getCategoryIcon(item.category)}
                        <span className="text-slate-600">{item.category}</span>
                      </span>

                      <span>·</span>

                      {/* Assignment Selector */}
                      <div className="flex items-center gap-1 text-slate-600">
                        <Users className="w-3 h-3 text-slate-400" />
                        <select
                          value={item.assignedToId || ''}
                          onChange={(e) => onAssignItem(item.id, e.target.value || undefined)}
                          className="bg-transparent text-[11px] font-medium text-slate-700 focus:outline-none border-b border-transparent hover:border-slate-300 py-0.5 cursor-pointer"
                        >
                          <option value="">{t.packing.unassigned}</option>
                          {members.map(m => (
                            <option key={m.id} value={m.id}>
                              Assigned to {m.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded ${
                      item.packed
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {item.packed ? t.packing.markPacked : t.packing.markUnpacked}
                  </span>

                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="p-1 hover:bg-rose-50 text-slate-300 hover:text-rose-600 rounded transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Custom Packing Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {t.packing.addItem}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Add gear or travel documentation to your group packing roster.
            </p>

            <form onSubmit={handleCreateItem} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Item Description *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Italian power adapter, trekking poles, sunscreen"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs bg-white"
                  >
                    <option value="essentials">Essentials &amp; Docs</option>
                    <option value="clothing">Clothing &amp; Shoes</option>
                    <option value="electronics">Electronics &amp; Cables</option>
                    <option value="weather">Weather &amp; Sun</option>
                    <option value="group">Shared Group Equipment</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    {t.packing.assignedTo}
                  </label>
                  <select
                    value={newItemAssigned}
                    onChange={(e) => setNewItemAssigned(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs bg-white"
                  >
                    <option value="">{t.packing.unassigned}</option>
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Notes / Specification
                </label>
                <input
                  type="text"
                  placeholder="e.g. Type C/F 220V plug required for Italy"
                  value={newItemNotes}
                  onChange={(e) => setNewItemNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg font-medium"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold shadow-xs"
                >
                  {t.common.add}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
