import React, { useState } from 'react';
import { useWalletStore, useToastStore } from '../store';
import { formatIDR } from '../utils/helpers';
import { Plus, X, Trash2 } from 'lucide-react';
import CurrencyInput from '../components/CurrencyInput';

const walletTypes = [
  { value: 'cash', label: 'Cash', icon: '💵' },
  { value: 'bank', label: 'Bank', icon: '🏦' },
  { value: 'ewallet', label: 'E-Wallet', icon: '📱' },
];

const walletColors = ['#5B8C5A', '#5B9EA6', '#E8A838', '#C75C5C', '#8B5CF6', '#EC4899'];

export default function Dompet() {
  const { wallets, addWallet, deleteWallet } = useWalletStore();
  const { addToast } = useToastStore();
  const [showModal, setShowModal] = useState(false);
  const [walletToDelete, setWalletToDelete] = useState(null);
  const [name, setName] = useState('');
  const [type, setType] = useState('cash');
  const [balance, setBalance] = useState('');
  const [color, setColor] = useState(walletColors[0]);

  const totalBalance = wallets.reduce((s, w) => s + w.balance, 0);
  const selectedType = walletTypes.find((t) => t.value === type);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) { addToast('Nama dompet wajib diisi', 'error'); return; }

    addWallet({
      name: name.trim(),
      type,
      balance: Number(balance) || 0,
      icon: selectedType?.icon || '💰',
      color,
    });

    addToast('Dompet berhasil ditambahkan! 🌿');
    setShowModal(false);
    setName('');
    setBalance('');
  };

  const handleDeleteClick = (id, walletName) => {
    setWalletToDelete({ id, name: walletName });
  };

  const confirmDelete = () => {
    if (walletToDelete) {
      deleteWallet(walletToDelete.id);
      addToast('Dompet berhasil dihapus');
      setWalletToDelete(null);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1>Dompet</h1>
          <p className="text-muted mt-2">Total: {formatIDR(totalBalance)}</p>
        </div>
        <button className="zen-btn zen-btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Tambah Dompet
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {wallets.map((w) => (
          <div key={w.id} className="zen-card flex justify-between items-center" style={{ padding: '20px 24px' }}>
            <div className="flex items-center gap-4">
              <div style={{
                width: 48, height: 48, borderRadius: 'var(--radius-md)',
                background: `${w.color}15`, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '1.5rem',
              }}>
                {w.icon}
              </div>
              <div>
                <h3>{w.name}</h3>
                <p className="text-xs text-muted" style={{ textTransform: 'capitalize' }}>{w.type}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <h3>{formatIDR(w.balance)}</h3>
              <button className="zen-btn zen-btn-ghost zen-btn-sm" onClick={() => handleDeleteClick(w.id, w.name)}>
                <Trash2 size={16} color="var(--zen-rose)" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Wallet Modal */}
      {showModal && (
        <div className="zen-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="zen-modal" onClick={(e) => e.stopPropagation()}>
            <div className="zen-modal-header">
              <h2>Dompet Baru</h2>
              <button className="zen-btn zen-btn-ghost" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="zen-label">Nama Dompet</label>
                <input className="zen-input" placeholder="cth. BCA, GoPay..." value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="mb-4">
                <label className="zen-label">Tipe</label>
                <div className="flex gap-2">
                  {walletTypes.map((t) => (
                    <button key={t.value} type="button"
                      className={`zen-btn zen-btn-sm ${type === t.value ? 'zen-btn-primary' : 'zen-btn-ghost'}`}
                      onClick={() => setType(t.value)}>
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="zen-label">Saldo Awal (Rp)</label>
                <CurrencyInput value={balance} onChange={setBalance} />
              </div>
              <div className="mb-5">
                <label className="zen-label">Warna</label>
                <div className="flex gap-2">
                  {walletColors.map((c) => (
                    <div key={c} onClick={() => setColor(c)}
                      style={{
                        width: 32, height: 32, borderRadius: '50%', background: c, cursor: 'pointer',
                        border: color === c ? '3px solid var(--zen-bark)' : '3px solid transparent',
                      }} />
                  ))}
                </div>
              </div>
              <button type="submit" className="zen-btn zen-btn-primary zen-btn-block zen-btn-lg">Simpan Dompet</button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {walletToDelete && (
        <div className="zen-modal-overlay" onClick={() => setWalletToDelete(null)}>
          <div className="zen-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px', textAlign: 'center' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%', background: 'var(--zen-rose-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
            }}>
              <Trash2 size={32} color="var(--zen-rose)" />
            </div>
            <h2 className="mb-2">Hapus Dompet?</h2>
            <p className="text-muted mb-6">
              Apakah kamu yakin ingin menghapus dompet "{walletToDelete.name}"? Transaksi yang sudah tercatat di dompet ini akan tetap ada.
            </p>
            <div className="flex gap-3">
              <button className="zen-btn zen-btn-outline" style={{ flex: 1 }} onClick={() => setWalletToDelete(null)}>
                Batal
              </button>
              <button className="zen-btn" style={{ flex: 1, background: 'var(--zen-rose)', color: 'white' }} onClick={confirmDelete}>
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
