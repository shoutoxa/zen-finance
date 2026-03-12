import React, { useState, useMemo } from 'react';
import { useTransactionStore, useWalletStore, useUserStore, useToastStore } from '../store';
import { formatIDR, expenseCategories, incomeCategories, categoryIcons, toISODate, formatDate } from '../utils/helpers';
import { Plus, Search, X, Filter, Trash2, Edit2, AlertTriangle, ArrowRight } from 'lucide-react';
import CurrencyInput from '../components/CurrencyInput';

export default function Transaksi() {
  const { transactions, addTransaction, deleteTransaction, updateTransaction } = useTransactionStore();
  const { wallets, adjustBalance } = useWalletStore();
  const { recordActivity } = useUserStore();
  const { addToast } = useToastStore();

  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [txToDelete, setTxToDelete] = useState(null);
  const [editingTxId, setEditingTxId] = useState(null);

  // Form state
  const [txType, setTxType] = useState('expense');
  const [txDate, setTxDate] = useState(toISODate());
  const [txAmount, setTxAmount] = useState('');
  const [txWallet, setTxWallet] = useState('');
  const [txDestWallet, setTxDestWallet] = useState('');
  const [txCategory, setTxCategory] = useState('');
  const [txNote, setTxNote] = useState('');

  const categories = txType === 'income' ? incomeCategories : expenseCategories;

  const filteredTxs = useMemo(() => {
    return transactions.filter((tx) => {
      const s = searchQuery.toLowerCase();
      const matchSearch = !s || (tx.note || '').toLowerCase().includes(s) || (tx.category || '').toLowerCase().includes(s);
      const matchType = !filterType || tx.type === filterType;
      return matchSearch && matchType;
    });
  }, [transactions, searchQuery, filterType]);

  const groupedTxs = useMemo(() => {
    const map = {};
    filteredTxs.forEach((tx) => {
      const dateKey = tx.date || toISODate();
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(tx);
    });
    return Object.entries(map)
      .sort(([a], [b]) => new Date(b) - new Date(a))
      .map(([date, txs]) => ({ date, transactions: txs }));
  }, [filteredTxs]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!txAmount || Number(txAmount) <= 0) {
      addToast('Jumlah harus lebih dari 0', 'error');
      return;
    }

    if (txType === 'transfer' && (!txWallet || !txDestWallet || txWallet === txDestWallet)) {
      addToast('Pilih sumber dan tujuan dompet yang berbeda', 'error');
      return;
    }

    const amount = Number(txAmount);
    const walletId = txWallet || wallets[0]?.id;
    const destWalletId = txType === 'transfer' ? txDestWallet : undefined;

    const payload = {
      type: txType,
      amount,
      walletId,
      destWalletId, // For transfers
      category: txType === 'transfer' ? 'Transfer' : (txCategory || categories[0]),
      note: txNote,
      date: txDate,
    };

    if (editingTxId) {
      // Reverse old tx effect
      const oldTx = transactions.find(t => t.id === editingTxId);
      if (oldTx) {
        if (oldTx.type === 'income') adjustBalance(oldTx.walletId, -oldTx.amount);
        else if (oldTx.type === 'expense' || oldTx.type === 'savings') adjustBalance(oldTx.walletId, oldTx.amount);
        else if (oldTx.type === 'transfer') {
          adjustBalance(oldTx.walletId, oldTx.amount);
          adjustBalance(oldTx.destWalletId, -oldTx.amount);
        }
      }
      // Apply update
      updateTransaction(editingTxId, payload);
    } else {
      addTransaction(payload);
    }

    // Apply new wallet balance
    if (txType === 'income') adjustBalance(walletId, amount);
    else if (txType === 'expense' || txType === 'savings') adjustBalance(walletId, -amount);
    else if (txType === 'transfer') {
      adjustBalance(walletId, -amount);
      adjustBalance(destWalletId, amount);
    }

    if (!editingTxId) recordActivity();

    addToast(editingTxId ? 'Transaksi diperbarui! 🌿' : 'Transaksi berhasil disimpan! 🌿');
    resetForm();
  };

  const resetForm = () => {
    setShowModal(false);
    setEditingTxId(null);
    setTxType('expense');
    setTxDate(toISODate());
    setTxAmount('');
    setTxWallet('');
    setTxDestWallet('');
    setTxCategory('');
    setTxNote('');
  };

  const openEditModal = (tx) => {
    setEditingTxId(tx.id);
    setTxType(tx.type);
    setTxDate(tx.date);
    setTxAmount(tx.amount.toString());
    setTxWallet(tx.walletId);
    if (tx.type === 'transfer') setTxDestWallet(tx.destWalletId);
    else setTxCategory(tx.category);
    setTxNote(tx.note);
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (txToDelete) {
      deleteTransaction(txToDelete.id);
      // reverse balance
      if (txToDelete.type === 'income') adjustBalance(txToDelete.walletId, -txToDelete.amount);
      else if (txToDelete.type === 'expense' || txToDelete.type === 'savings') adjustBalance(txToDelete.walletId, txToDelete.amount);
      else if (txToDelete.type === 'transfer') {
        adjustBalance(txToDelete.walletId, txToDelete.amount);
        adjustBalance(txToDelete.destWalletId, -txToDelete.amount);
      }
      addToast('Transaksi dihapus', 'info');
      setTxToDelete(null);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-5">
        <h1>Transaksi</h1>
        <button className="zen-btn zen-btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Tambah
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 mb-5 mobile-flex-col">
        <div className="flex items-center gap-2 zen-card" style={{ flex: 1, padding: '10px 16px' }}>
          <Search size={18} color="var(--zen-bark-light)" />
          <input
            className="zen-input"
            style={{ border: 'none', padding: 0, boxShadow: 'none' }}
            placeholder="Cari transaksi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select className="zen-select" style={{ width: 'auto', minWidth: '140px' }}
          value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="">Semua Tipe</option>
          <option value="expense">Pengeluaran</option>
          <option value="income">Pemasukan</option>
          <option value="savings">Tabungan</option>
          <option value="transfer">Transfer</option>
        </select>
      </div>

      {/* Transactions List */}
      {groupedTxs.length === 0 ? (
        <div className="zen-card text-center p-6">
          <p style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🌱</p>
          <h3>Belum Ada Transaksi</h3>
          <p className="text-muted mt-2">Ketuk "Tambah" untuk mencatat transaksi pertamamu.</p>
        </div>
      ) : (
        groupedTxs.map((group) => (
          <div key={group.date} className="mb-5">
            <p className="text-xs font-semibold text-muted mb-3" style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {formatDate(group.date)}
            </p>
            <div className="flex flex-col gap-2">
              {group.transactions.map((tx) => (
                <div key={tx.id} className="zen-card flex justify-between items-center" style={{ padding: '14px 20px' }}>
                  <div className="flex items-center gap-3">
                    <span style={{ fontSize: '1.25rem' }}>{tx.type === 'transfer' ? '🔄' : (categoryIcons[tx.category] || '💰')}</span>
                    <div>
                      <p className="font-medium">{tx.note || tx.category}</p>
                      <p className="text-xs text-muted">
                        {tx.type === 'transfer' ? (
                          <>
                            {wallets.find((w) => w.id === tx.walletId)?.name} <ArrowRight size={10} style={{ display: 'inline' }} /> {wallets.find((w) => w.id === tx.destWalletId)?.name}
                          </>
                        ) : (
                          `${tx.category} · ${wallets.find((w) => w.id === tx.walletId)?.name || ''}`
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className={`font-semibold ${tx.type === 'income' ? 'text-leaf' : (tx.type === 'transfer' ? 'text-muted' : 'text-rose')}`}>
                      {tx.type === 'income' ? '+' : (tx.type === 'transfer' ? '' : '-')}{formatIDR(tx.amount)}
                    </p>
                    <div className="flex gap-1 opacity-60 hover:opacity-100 transition-opacity">
                      <button className="zen-btn zen-btn-ghost zen-btn-sm" style={{ padding: '4px' }} onClick={() => openEditModal(tx)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="zen-btn zen-btn-ghost zen-btn-sm" style={{ padding: '4px' }} onClick={() => setTxToDelete(tx)}>
                        <Trash2 size={16} color="var(--zen-rose)" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Add Transaction Modal */}
      {showModal && (
        <div className="zen-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="zen-modal" onClick={(e) => e.stopPropagation()}>
            <div className="zen-modal-header">
              <h2>{editingTxId ? 'Edit Transaksi' : 'Transaksi Baru'}</h2>
              <button className="zen-btn zen-btn-ghost" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Type Tabs */}
            <div className="flex gap-2 mb-5" style={{ flexWrap: 'wrap' }}>
              {[
                { key: 'expense', label: 'Keluar', color: 'var(--zen-rose)' },
                { key: 'income', label: 'Masuk', color: 'var(--zen-leaf)' },
                { key: 'savings', label: 'Tabungan', color: 'var(--zen-sun)' },
                { key: 'transfer', label: 'Transfer', color: 'var(--zen-bark)' },
              ].map(({ key, label, color }) => (
                <button key={key}
                  className={`zen-btn zen-btn-sm ${txType === key ? '' : 'zen-btn-ghost'}`}
                  style={txType === key ? { background: color, color: 'white' } : {}}
                  onClick={() => { setTxType(key); setTxCategory(''); }}
                >
                  {label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="zen-label">Tanggal</label>
                <input type="date" className="zen-input" value={txDate}
                  onChange={(e) => setTxDate(e.target.value)} />
              </div>

              <div className="mb-4">
                <label className="zen-label">Jumlah (Rp)</label>
                <CurrencyInput
                  value={txAmount}
                  onChange={setTxAmount}
                  style={{ fontSize: '1.25rem', fontWeight: 700 }}
                />
              </div>

              {txType === 'transfer' ? (
                <>
                  <div className="mb-4">
                    <label className="zen-label">Dari Dompet</label>
                    <select className="zen-select" value={txWallet}
                      onChange={(e) => setTxWallet(e.target.value)}>
                      <option value="">Pilih dompet sumber...</option>
                      {wallets.map((w) => (
                        <option key={w.id} value={w.id}>{w.icon} {w.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="zen-label">Ke Dompet</label>
                    <select className="zen-select" value={txDestWallet}
                      onChange={(e) => setTxDestWallet(e.target.value)}>
                      <option value="">Pilih dompet tujuan...</option>
                      {wallets.map((w) => (
                        <option key={w.id} value={w.id}>{w.icon} {w.name}</option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="zen-label">Dompet</label>
                    <select className="zen-select" value={txWallet}
                      onChange={(e) => setTxWallet(e.target.value)}>
                      <option value="">Pilih dompet...</option>
                      {wallets.map((w) => (
                        <option key={w.id} value={w.id}>{w.icon} {w.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="zen-label">Kategori</label>
                    <select className="zen-select" value={txCategory}
                      onChange={(e) => setTxCategory(e.target.value)}>
                      <option value="">Pilih kategori...</option>
                      {categories.map((c) => (
                        <option key={c} value={c}>{categoryIcons[c] || '📁'} {c}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div className="mb-5">
                <label className="zen-label">Catatan</label>
                <input type="text" className="zen-input" placeholder="cth. Kopi Kenangan"
                  value={txNote} onChange={(e) => setTxNote(e.target.value)} />
              </div>

              <button type="submit" className="zen-btn zen-btn-primary zen-btn-block zen-btn-lg">
                {editingTxId ? 'Perbarui Transaksi' : 'Simpan Transaksi'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {txToDelete && (
        <div className="zen-modal-overlay" onClick={() => setTxToDelete(null)}>
          <div className="zen-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px', textAlign: 'center' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%', background: 'var(--zen-rose-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
            }}>
              <AlertTriangle size={32} color="var(--zen-rose)" />
            </div>
            <h2 className="mb-2">Hapus Transaksi?</h2>
            <p className="text-muted mb-6">
              Transakasi senilai <strong>{formatIDR(txToDelete.amount)}</strong> akan dihapus dan saldo dompet akan dikembalikan.
            </p>
            <div className="flex gap-3">
              <button className="zen-btn zen-btn-outline" style={{ flex: 1 }} onClick={() => setTxToDelete(null)}>
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
