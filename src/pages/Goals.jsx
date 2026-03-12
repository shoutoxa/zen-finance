import React, { useState } from 'react';
import { useGoalStore, useToastStore, useUserStore } from '../store';
import { formatIDR, badgeDefinitions } from '../utils/helpers';
import { Plus, X, Target, Trophy } from 'lucide-react';
import CurrencyInput from '../components/CurrencyInput';

export default function Goals() {
  const { goals, addGoal, addSavings } = useGoalStore();
  const { badges } = useUserStore();
  const { addToast } = useToastStore();
  const [showModal, setShowModal] = useState(false);
  const [showAddSavings, setShowAddSavings] = useState(null);
  const [savingsAmount, setSavingsAmount] = useState('');
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalIcon, setGoalIcon] = useState('🎯');

  const goalIcons = ['🎯', '🏖️', '🚗', '🏠', '💻', '📚', '🎮', '💍', '🏥', '✈️'];

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!goalName.trim() || !goalTarget || Number(goalTarget) <= 0) {
      addToast('Nama dan target wajib diisi', 'error');
      return;
    }
    addGoal({ name: goalName.trim(), targetAmount: Number(goalTarget), icon: goalIcon });
    addToast('Target baru ditambahkan! 🎯');
    setShowModal(false);
    setGoalName('');
    setGoalTarget('');
  };

  const handleAddSavings = (goalId) => {
    const amt = Number(savingsAmount);
    if (amt <= 0) { addToast('Jumlah harus lebih dari 0', 'error'); return; }
    addSavings(goalId, amt);
    addToast(`Berhasil menambah ${formatIDR(amt)}! 🌿`);
    setShowAddSavings(null);
    setSavingsAmount('');
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1>Goals</h1>
          <p className="text-muted mt-2">Target menabungmu 🎯</p>
        </div>
        <button className="zen-btn zen-btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Target Baru
        </button>
      </div>

      {/* Goals List */}
      {goals.length === 0 ? (
        <div className="zen-card text-center p-6">
          <p style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🎯</p>
          <h3>Belum Ada Target</h3>
          <p className="text-muted mt-2">Buat target pertamamu dan mulai menabung!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {goals.map((goal) => {
            const pct = goal.targetAmount > 0 ? Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100)) : 0;
            const remaining = Math.max(0, goal.targetAmount - goal.savedAmount);
            return (
              <div key={goal.id} className="zen-card" style={{ padding: '24px' }}>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: '2rem' }}>{goal.icon}</span>
                    <div>
                      <h3>{goal.name}</h3>
                      <p className="text-xs text-muted">Sisa {formatIDR(remaining)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {pct >= 100 && <Trophy size={20} color="var(--zen-sun)" />}
                    <span className={`zen-badge ${pct >= 100 ? 'zen-badge-sun' : 'zen-badge-leaf'}`}>{pct}%</span>
                  </div>
                </div>
                <div className="zen-progress mb-3" style={{ height: 10 }}>
                  <div className="zen-progress-fill" style={{
                    width: `${pct}%`,
                    background: pct >= 100 ? 'var(--zen-sun)' : 'var(--zen-leaf)',
                  }} />
                </div>
                <div className="flex justify-between items-center mobile-flex-col mobile-gap-3" style={{ alignItems: 'flex-start' }}>
                  <p className="text-sm font-semibold">{formatIDR(goal.savedAmount)} / {formatIDR(goal.targetAmount)}</p>
                  <div className="flex gap-2">
                    {showAddSavings === goal.id ? (
                      <div className="flex gap-2">
                        <CurrencyInput
                          value={savingsAmount}
                          onChange={setSavingsAmount}
                          style={{ width: 120, padding: '6px 10px' }}
                          placeholder="Jumlah"
                          autoFocus
                        />
                        <button className="zen-btn zen-btn-primary zen-btn-sm" onClick={() => handleAddSavings(goal.id)}>+</button>
                        <button className="zen-btn zen-btn-ghost zen-btn-sm" onClick={() => setShowAddSavings(null)}>
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <button className="zen-btn zen-btn-outline zen-btn-sm" onClick={() => setShowAddSavings(goal.id)}>
                        + Tambah Tabungan
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Badges Section */}
      <div className="mt-6">
        <h3 className="mb-4 flex items-center gap-2"><Trophy size={20} color="var(--zen-sun)" /> Badges</h3>
        <div className="flex gap-3" style={{ flexWrap: 'wrap' }}>
          {Object.entries(badgeDefinitions).map(([key, badge]) => {
            const earned = badges.includes(key);
            return (
              <div key={key} className="zen-card text-center" style={{
                padding: '16px', minWidth: '130px', flex: '1 1 130px', opacity: earned ? 1 : 0.4,
              }}>
                <div className={earned ? 'animate-pop' : ''} style={{ fontSize: '2rem', marginBottom: '6px' }}>
                  {badge.icon}
                </div>
                <p className="text-xs font-semibold">{badge.name}</p>
                <p className="text-xs text-muted mt-1">{badge.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Goal Modal */}
      {showModal && (
        <div className="zen-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="zen-modal" onClick={(e) => e.stopPropagation()}>
            <div className="zen-modal-header">
              <h2>Target Baru</h2>
              <button className="zen-btn zen-btn-ghost" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddGoal}>
              <div className="mb-4">
                <label className="zen-label">Icon</label>
                <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                  {goalIcons.map((icon) => (
                    <div key={icon} onClick={() => setGoalIcon(icon)} style={{
                      fontSize: '1.5rem', padding: '8px', borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer', background: goalIcon === icon ? 'var(--zen-leaf-light)' : 'transparent',
                      border: goalIcon === icon ? '2px solid var(--zen-leaf)' : '2px solid transparent',
                    }}>{icon}</div>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="zen-label">Nama Target</label>
                <input className="zen-input" placeholder="cth. Dana Darurat" value={goalName} onChange={(e) => setGoalName(e.target.value)} />
              </div>
              <div className="mb-5">
                <label className="zen-label">Jumlah Target (Rp)</label>
                <CurrencyInput value={goalTarget} onChange={setGoalTarget} />
              </div>
              <button type="submit" className="zen-btn zen-btn-primary zen-btn-block zen-btn-lg">Buat Target</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
