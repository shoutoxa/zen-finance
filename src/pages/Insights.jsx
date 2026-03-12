import React, { useMemo } from 'react';
import { useTransactionStore, useGoalStore } from '../store';
import { generateInsights } from '../services/aiEngine';
import { Sparkles, AlertTriangle, Lightbulb, CheckCircle, Info } from 'lucide-react';

const iconMap = {
  warning: AlertTriangle,
  tip: Lightbulb,
  success: CheckCircle,
  info: Info,
};

const colorMap = {
  warning: { bg: 'var(--zen-rose-light)', border: 'var(--zen-rose)', icon: 'var(--zen-rose)' },
  tip: { bg: 'var(--zen-sun-light)', border: 'var(--zen-sun)', icon: 'var(--zen-sun)' },
  success: { bg: 'var(--zen-leaf-light)', border: 'var(--zen-leaf)', icon: 'var(--zen-leaf)' },
  info: { bg: 'var(--zen-lake-light)', border: 'var(--zen-lake)', icon: 'var(--zen-lake)' },
};

export default function Insights() {
  const { transactions } = useTransactionStore();
  const { goals } = useGoalStore();

  const insights = useMemo(
    () => generateInsights(transactions, [], goals),
    [transactions, goals]
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-5">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles size={28} color="var(--zen-sun)" />
          <h1>AI Insights</h1>
        </div>
        <p className="text-muted">Analisis cerdas kebiasaan keuanganmu 🌿</p>
      </div>

      {insights.length === 0 ? (
        <div className="zen-card text-center p-6">
          <p style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🧠</p>
          <h3>Belum Ada Insight</h3>
          <p className="text-muted mt-2">Catat lebih banyak transaksi untuk mendapat analisis keuangan.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {insights.map((insight, i) => {
            const colors = colorMap[insight.type] || colorMap.info;
            const Icon = iconMap[insight.type] || Info;
            return (
              <div key={i} className="zen-card animate-slide-up" style={{
                borderLeft: `4px solid ${colors.border}`,
                padding: '20px 24px',
                animationDelay: `${i * 100}ms`,
                animationFillMode: 'both',
              }}>
                <div className="flex items-center gap-3 mb-2">
                  <div style={{
                    background: colors.bg, borderRadius: 'var(--radius-sm)',
                    padding: '8px', display: 'flex',
                  }}>
                    <Icon size={18} color={colors.icon} />
                  </div>
                  <h3>{insight.title}</h3>
                </div>
                <p className="text-sm" style={{ lineHeight: 1.7, color: 'var(--zen-bark-light)' }}>
                  {insight.message}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <div className="zen-card mt-6" style={{ background: 'var(--zen-leaf-light)', textAlign: 'center', padding: '24px' }}>
        <p className="text-sm text-muted">
          💡 Tip: Semakin banyak transaksi yang kamu catat, semakin akurat insight yang diberikan.
        </p>
      </div>
    </div>
  );
}
