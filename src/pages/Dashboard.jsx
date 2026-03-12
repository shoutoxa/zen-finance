import React, { useMemo } from 'react';
import { useWalletStore, useTransactionStore, useUserStore } from '../store';
import { formatIDR, getMonthName, plantEmojis } from '../utils/helpers';
import { TrendingUp, TrendingDown, Wallet, Flame } from 'lucide-react';

export default function Dashboard() {
  const { wallets } = useWalletStore();
  const { transactions, getMonthlyTotals } = useTransactionStore();
  const { streak, plantStage, level, totalXP } = useUserStore();
  const levelName = useUserStore((s) => s.getLevelName());

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const totals = useMemo(() => getMonthlyTotals(year, month), [getMonthlyTotals, year, month]);
  const totalBalance = useMemo(() => wallets.reduce((s, w) => s + w.balance, 0), [wallets]);

  const recentTxs = useMemo(() =>
    transactions.slice(0, 5), [transactions]
  );

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-start mb-6" style={{ flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1>Dashboard</h1>
          <p className="text-muted mt-2">Halo! 🌿 Selamat datang kembali.</p>
        </div>
        <div className="zen-badge zen-badge-leaf">
          {getMonthName(month)} {year}
        </div>
      </div>

      {/* Balance Card */}
      <div className="zen-card mb-5" style={{ background: 'var(--zen-bark)', color: 'white', padding: '32px' }}>
        <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.7, marginBottom: '8px' }}>
          Total Saldo
        </p>
        <h1 className="animate-count-up" style={{ fontSize: '2.5rem', color: 'white', marginBottom: '16px' }}>
          {formatIDR(totalBalance)}
        </h1>
        <div className="flex gap-6 mobile-flex-col mobile-gap-3">
          <div className="flex items-center gap-2">
            <div style={{ background: 'rgba(91,140,90,0.3)', borderRadius: '50%', padding: '6px', display: 'flex' }}>
              <TrendingUp size={16} color="#5B8C5A" />
            </div>
            <div>
              <p style={{ fontSize: '0.6875rem', opacity: 0.6 }}>Pemasukan</p>
              <p className="font-semibold">{formatIDR(totals.income)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div style={{ background: 'rgba(199,92,92,0.3)', borderRadius: '50%', padding: '6px', display: 'flex' }}>
              <TrendingDown size={16} color="#C75C5C" />
            </div>
            <div>
              <p style={{ fontSize: '0.6875rem', opacity: 0.6 }}>Pengeluaran</p>
              <p className="font-semibold">{formatIDR(totals.expense)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Streak & Gamification */}
      <div className="flex gap-4 mb-5 mobile-flex-col mobile-gap-3">
        <div className="zen-card flex-col items-center text-center" style={{ flex: 1, padding: '24px' }}>
          <div className="animate-grow" style={{ fontSize: '3rem', marginBottom: '8px' }}>
            {plantEmojis[plantStage]}
          </div>
          <h3>{plantStage === 'seed' ? 'Mulai Hari Ini!' : `${streak} Hari Streak`}</h3>
          <p className="text-xs text-muted mt-2">Catat transaksi tiap hari untuk menumbuhkan tanamanmu</p>
        </div>
        <div className="zen-card" style={{ flex: 1, padding: '24px' }}>
          <div className="flex items-center gap-2 mb-4">
            <Flame size={20} color="var(--zen-sun)" />
            <h3>Level {level}</h3>
          </div>
          <p className="font-semibold text-leaf">{levelName}</p>
          <div className="zen-progress mt-3">
            <div className="zen-progress-fill" style={{ width: `${(totalXP % 100)}%` }}></div>
          </div>
          <p className="text-xs text-muted mt-2">{totalXP % 100}/100 XP ke level berikutnya</p>
        </div>
      </div>

      {/* Quick Wallets */}
      <div className="mb-5">
        <h3 className="mb-4">Dompet</h3>
        <div className="flex gap-3" style={{ overflowX: 'auto' }}>
          {wallets.map((w) => (
            <div key={w.id} className="zen-card flex items-center gap-3"
              style={{ minWidth: '200px', padding: '16px' }}>
              <span style={{ fontSize: '1.5rem' }}>{w.icon}</span>
              <div>
                <p className="font-semibold">{w.name}</p>
                <p className="text-sm text-muted">{formatIDR(w.balance)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <h3 className="mb-4">Transaksi Terbaru</h3>
        {recentTxs.length === 0 ? (
          <div className="zen-card text-center p-6">
            <p style={{ fontSize: '2rem', marginBottom: '8px' }}>🌱</p>
            <p className="text-muted">Belum ada transaksi. Mulai catat keuanganmu!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {recentTxs.map((tx) => (
              <div key={tx.id} className="zen-card flex justify-between items-center" style={{ padding: '14px 20px' }}>
                <div className="flex items-center gap-3">
                  <span style={{ fontSize: '1.25rem' }}>
                    {tx.type === 'income' ? '💰' : tx.type === 'savings' ? '🐷' : '🛒'}
                  </span>
                  <div>
                    <p className="font-medium">{tx.note || tx.category || tx.type}</p>
                    <p className="text-xs text-muted">{tx.category}</p>
                  </div>
                </div>
                <p className={`font-semibold ${tx.type === 'income' ? 'text-leaf' : 'text-rose'}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatIDR(tx.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
