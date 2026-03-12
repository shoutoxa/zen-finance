import React, { useMemo } from 'react';
import { useTransactionStore } from '../store';
import { formatIDR, getMonthName, categoryIcons } from '../utils/helpers';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const colors = ['#5B8C5A', '#E8A838', '#5B9EA6', '#C75C5C', '#8B5CF6', '#EC4899', '#F97316', '#06B6D4'];

export default function Laporan() {
  const { getMonthlyTotals, getCategoryBreakdown } = useTransactionStore();

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const totals = useMemo(() => getMonthlyTotals(year, month), [getMonthlyTotals, year, month]);
  const categories = useMemo(() => getCategoryBreakdown(year, month), [getCategoryBreakdown, year, month]);

  const totalExpense = totals.expense || 1;

  const chartData = useMemo(() => ({
    labels: categories.length > 0 ? categories.map((c) => c.name) : ['Belum ada data'],
    datasets: [{
      data: categories.length > 0 ? categories.map((c) => c.amount) : [1],
      backgroundColor: categories.length > 0 ? colors.slice(0, categories.length) : ['#E5DFD8'],
      borderWidth: 0,
      hoverOffset: 4,
    }],
  }), [categories]);

  const chartOptions = {
    cutout: '70%',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ${formatIDR(ctx.raw)}`,
        },
      },
    },
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-5">
        <h1>Laporan</h1>
        <p className="text-muted mt-2">{getMonthName(month)} {year}</p>
      </div>

      {/* Summary Cards */}
      <div className="flex gap-4 mb-6">
        <div className="zen-card" style={{ flex: 1 }}>
          <p className="zen-label">Pemasukan</p>
          <h2 className="text-leaf">{formatIDR(totals.income)}</h2>
        </div>
        <div className="zen-card" style={{ flex: 1 }}>
          <p className="zen-label">Pengeluaran</p>
          <h2 className="text-rose">{formatIDR(totals.expense)}</h2>
        </div>
        <div className="zen-card" style={{ flex: 1 }}>
          <p className="zen-label">Tabungan</p>
          <h2 className="text-sun">{formatIDR(totals.savings)}</h2>
        </div>
      </div>

      {/* Chart + Categories */}
      <div className="flex gap-5" style={{ flexWrap: 'wrap' }}>
        <div className="zen-card" style={{ flex: '1 1 280px', textAlign: 'center' }}>
          <h3 className="mb-4">Pengeluaran per Kategori</h3>
          <div style={{ maxWidth: 240, margin: '0 auto' }}>
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="zen-card" style={{ flex: '1 1 320px' }}>
          <h3 className="mb-4">Detail Kategori</h3>
          {categories.length === 0 ? (
            <p className="text-muted text-center p-6">Belum ada pengeluaran bulan ini.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {categories.map((cat, i) => {
                const pct = Math.round((cat.amount / totalExpense) * 100);
                return (
                  <div key={cat.name}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span>{categoryIcons[cat.name] || '📁'}</span>
                        <span className="font-medium text-sm">{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold">{formatIDR(cat.amount)}</span>
                        <span className="zen-badge zen-badge-leaf text-xs">{pct}%</span>
                      </div>
                    </div>
                    <div className="zen-progress">
                      <div className="zen-progress-fill" style={{ width: `${pct}%`, background: colors[i % colors.length] }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
