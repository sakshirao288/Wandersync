import React, { useState } from 'react';
import { GroupMember, Expense, Settlement, Language } from '../types/travel';
import { translations } from '../utils/translations';
import { 
  DollarSign, 
  Plus, 
  Users, 
  ArrowRight, 
  PieChart, 
  Trash2, 
  CheckCircle2, 
  Receipt, 
  Calendar,
  CreditCard
} from 'lucide-react';

interface BudgetTrackerProps {
  members: GroupMember[];
  expenses: Expense[];
  totalTripBudget: number;
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onDeleteExpense: (expenseId: string) => void;
  onSettleDebt: (fromId: string, toId: string, amount: number) => void;
  lang: Language;
}

export const BudgetTracker: React.FC<BudgetTrackerProps> = ({
  members,
  expenses,
  totalTripBudget,
  onAddExpense,
  onDeleteExpense,
  onSettleDebt,
  lang,
}) => {
  const t = translations[lang];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [category, setCategory] = useState<Expense['category']>('food');
  const [paidById, setPaidById] = useState<string>(members[0]?.id || 'm1');
  const [splitAll, setSplitAll] = useState(true);
  const [selectedSplitIds, setSelectedSplitIds] = useState<string[]>(members.map(m => m.id));
  const [notes, setNotes] = useState('');

  // Total spent
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remainingBudget = totalTripBudget - totalSpent;
  const spentPercent = Math.min(100, Math.round((totalSpent / totalTripBudget) * 100));

  // Category breakdown
  const categories: Expense['category'][] = ['lodging', 'food', 'transport', 'activities', 'misc'];
  const categoryTotals = categories.map((cat) => {
    const total = expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0);
    return { category: cat, total, percentage: totalSpent > 0 ? Math.round((total / totalSpent) * 100) : 0 };
  });

  // Calculate net balances for each member
  // Positive = owed money back (creditor), Negative = owes the group (debtor)
  const netBalances: Record<string, number> = {};
  members.forEach(m => { netBalances[m.id] = 0; });

  expenses.forEach(exp => {
    const splitCount = exp.splitWithIds.length || members.length;
    const share = exp.amount / splitCount;

    // Credit the payer
    if (netBalances[exp.paidById] !== undefined) {
      netBalances[exp.paidById] += exp.amount;
    }

    // Debit each person who splits
    exp.splitWithIds.forEach(id => {
      if (netBalances[id] !== undefined) {
        netBalances[id] -= share;
      }
    });
  });

  // Splitwise settlement resolution algorithm (greedy match)
  const calculateSettlements = (): Settlement[] => {
    const settlements: Settlement[] = [];
    const debtors: { id: string; amount: number }[] = [];
    const creditors: { id: string; amount: number }[] = [];

    Object.entries(netBalances).forEach(([id, bal]) => {
      const rounded = Math.round(bal * 100) / 100;
      if (rounded < -0.5) {
        debtors.push({ id, amount: -rounded });
      } else if (rounded > 0.5) {
        creditors.push({ id, amount: rounded });
      }
    });

    let dIdx = 0;
    let cIdx = 0;

    while (dIdx < debtors.length && cIdx < creditors.length) {
      const debtor = debtors[dIdx];
      const creditor = creditors[cIdx];
      const payment = Math.min(debtor.amount, creditor.amount);

      if (payment > 0.5) {
        settlements.push({
          fromId: debtor.id,
          toId: creditor.id,
          amount: Math.round(payment),
        });
      }

      debtor.amount -= payment;
      creditor.amount -= payment;

      if (debtor.amount <= 0.5) dIdx++;
      if (creditor.amount <= 0.5) cIdx++;
    }

    return settlements;
  };

  const settlements = calculateSettlements();

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || amount <= 0) return;

    onAddExpense({
      title: title.trim(),
      amount: Number(amount),
      category,
      paidById,
      date: new Date().toISOString().split('T')[0],
      splitWithIds: splitAll ? members.map(m => m.id) : selectedSplitIds,
      notes: notes.trim(),
    });

    setTitle('');
    setAmount(0);
    setNotes('');
    setIsModalOpen(false);
  };

  const getMember = (id: string) => members.find(m => m.id === id);

  return (
    <div className="space-y-6">
      {/* Top Banner & Budget Counters */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight font-display">
              {t.budget.title}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {t.budget.subtitle}
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 whitespace-nowrap shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{t.budget.addExpense}</span>
          </button>
        </div>

        {/* 3 Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">
              {t.common.totalBudget}
            </span>
            <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
              ${totalTripBudget.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Shared by {members.length} group travelers
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">
              {t.common.totalSpent}
            </span>
            <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
              ${totalSpent.toLocaleString()}
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full ${spentPercent > 90 ? 'bg-rose-500' : 'bg-amber-500'}`}
                style={{ width: `${spentPercent}%` }}
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">
              {t.common.remaining}
            </span>
            <div className={`text-2xl font-bold font-mono tabular-nums mt-1 ${remainingBudget < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
              ${remainingBudget.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              ${Math.round(remainingBudget / members.length)} remaining per person
            </span>
          </div>
        </div>

        {/* Category breakdown bar */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            {t.budget.summaryByCategory}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {categoryTotals.map((item) => (
              <div key={item.category} className="p-2.5 rounded-lg border border-slate-100 bg-white">
                <span className="text-[11px] text-slate-500 capitalize block font-medium">
                  {item.category}
                </span>
                <span className="text-sm font-bold text-slate-900 font-mono tabular-nums block mt-0.5">
                  ${item.total}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {item.percentage}% of total
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Layout: Member Balances / Settlements & Expense Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Member Balances & Debt Settlement (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Member Net Balances */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-500" />
              <span>Traveler Balances</span>
            </h3>

            <div className="space-y-3">
              {members.map((member) => {
                const bal = Math.round((netBalances[member.id] || 0) * 100) / 100;
                const isCreditor = bal > 0.5;
                const isDebtor = bal < -0.5;

                return (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 bg-slate-50/60"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          {member.name}
                        </span>
                        <span className="text-[10px] text-slate-500 capitalize">
                          {member.role}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-xs font-bold font-mono tabular-nums block ${
                          isCreditor
                            ? 'text-emerald-700'
                            : isDebtor
                            ? 'text-rose-600'
                            : 'text-slate-500'
                        }`}
                      >
                        {isCreditor ? `+ $${bal}` : isDebtor ? `- $${Math.abs(bal)}` : 'Settled'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {isCreditor ? 'gets back' : isDebtor ? 'owes group' : 'balanced'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Settle Up Matrix */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center justify-between">
              <span>{t.budget.whoOwesWho}</span>
              <span className="text-[11px] font-normal text-slate-500">Minimal Transfers</span>
            </h3>

            {settlements.length === 0 ? (
              <div className="p-4 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t.budget.noDebts}</span>
              </div>
            ) : (
              <div className="space-y-2 mt-3">
                {settlements.map((settle, i) => {
                  const from = getMember(settle.fromId);
                  const to = getMember(settle.toId);

                  return (
                    <div
                      key={i}
                      className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-bold text-slate-900 truncate">{from?.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-bold text-slate-900 truncate">{to?.name}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-mono font-bold text-slate-900 tabular-nums">
                          ${settle.amount}
                        </span>
                        <button
                          onClick={() => onSettleDebt(settle.fromId, settle.toId, settle.amount)}
                          className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] font-medium transition-colors"
                        >
                          Settle
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Expense Ledger (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-slate-500" />
              <span>{t.budget.recentExpenses}</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              {expenses.length} Records
            </span>
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-[500px] pr-1">
            {expenses.map((exp) => {
              const payer = getMember(exp.paidById);
              return (
                <div
                  key={exp.id}
                  className="p-3 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50/50 flex items-center justify-between gap-3 transition-colors text-xs"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Receipt className="w-3.5 h-3.5" />
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 truncate">
                        {exp.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span className="capitalize font-medium text-slate-700">{exp.category}</span>
                        <span>·</span>
                        <span>Paid by {payer?.name}</span>
                        <span>·</span>
                        <span className="font-mono">{exp.date}</span>
                      </div>
                      {exp.notes && (
                        <p className="text-[11px] text-slate-600 mt-1 italic">
                          {exp.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono font-bold text-slate-900 text-sm tabular-nums">
                      ${exp.amount}
                    </span>
                    <button
                      onClick={() => onDeleteExpense(exp.id)}
                      className="p-1 hover:bg-rose-50 text-slate-300 hover:text-rose-600 rounded transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal: Add Expense */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {t.budget.addExpense}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter expense details and allocate shares among group members.
            </p>

            <form onSubmit={handleCreateExpense} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  {t.budget.expenseTitle} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Trastevere Dinner & Wine"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    {t.budget.amount} *
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    required
                    value={amount || ''}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs bg-white"
                  >
                    <option value="lodging">Lodging</option>
                    <option value="food">Food & Dining</option>
                    <option value="transport">Transportation</option>
                    <option value="activities">Activities & Tickets</option>
                    <option value="misc">Miscellaneous</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  {t.budget.paidBy}
                </label>
                <select
                  value={paidById}
                  onChange={(e) => setPaidById(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs bg-white"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  {t.budget.splitAmong}
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    id="splitAllCheck"
                    checked={splitAll}
                    onChange={(e) => setSplitAll(e.target.checked)}
                    className="rounded text-slate-900 focus:ring-slate-900"
                  />
                  <label htmlFor="splitAllCheck" className="text-xs text-slate-700">
                    {t.budget.allMembers}
                  </label>
                </div>

                {!splitAll && (
                  <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                    {members.map((m) => (
                      <label key={m.id} className="flex items-center gap-2 text-[11px] text-slate-700">
                        <input
                          type="checkbox"
                          checked={selectedSplitIds.includes(m.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSplitIds([...selectedSplitIds, m.id]);
                            } else {
                              setSelectedSplitIds(selectedSplitIds.filter(id => id !== m.id));
                            }
                          }}
                        />
                        <span>{m.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Notes / Receipt memo
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Split equally for 4, includes tip"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-xs resize-none"
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
                  {t.common.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
