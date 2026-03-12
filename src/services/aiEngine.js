/**
 * Zen Finance — AI Insights Engine (Rule-Based)
 * Generates smart financial insights from transaction data.
 */

export function generateInsights(transactions, wallets, goals) {
  const insights = [];
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  // Get current month transactions
  const monthTxs = transactions.filter((tx) => {
    const d = new Date(tx.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  let income = 0, expense = 0, savings = 0;
  const categoryMap = {};

  monthTxs.forEach((tx) => {
    const amt = Number(tx.amount) || 0;
    if (tx.type === 'income') income += amt;
    if (tx.type === 'expense') {
      expense += amt;
      const cat = tx.category || 'Lainnya';
      categoryMap[cat] = (categoryMap[cat] || 0) + amt;
    }
    if (tx.type === 'savings') savings += amt;
  });

  // Rule 1: Overspending warning
  if (income > 0 && expense > income * 0.8) {
    const pct = Math.round((expense / income) * 100);
    insights.push({
      type: 'warning',
      icon: '⚠️',
      title: 'Pengeluaran Tinggi',
      message: `Kamu sudah menghabiskan ${pct}% dari pemasukanmu bulan ini. Coba kurangi pengeluaran di sisa bulan.`,
      priority: 1,
    });
  }

  // Rule 2: Top category dominance
  const topCats = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
  if (topCats.length > 0 && expense > 0) {
    const [topName, topAmt] = topCats[0];
    const topPct = Math.round((topAmt / expense) * 100);
    if (topPct > 40) {
      insights.push({
        type: 'tip',
        icon: '💡',
        title: `${topName} Mendominasi`,
        message: `${topName} mengambil ${topPct}% dari total pengeluaranmu. Pertimbangkan untuk diversifikasi pengeluaran.`,
        priority: 2,
      });
    }
  }

  // Rule 3: Good savings ratio
  if (income > 0 && savings >= income * 0.2) {
    const ratio = Math.round((savings / income) * 100);
    insights.push({
      type: 'success',
      icon: '🎉',
      title: 'Menabung Bagus!',
      message: `Rasio menabungmu ${ratio}% bulan ini. Ini di atas rata-rata 20%. Teruskan!`,
      priority: 3,
    });
  }

  // Rule 4: No income recorded
  if (income === 0 && monthTxs.length > 0) {
    insights.push({
      type: 'info',
      icon: '💰',
      title: 'Belum Ada Pemasukan',
      message: 'Belum ada pemasukan tercatat bulan ini. Jangan lupa catat gaji atau pendapatan lainnya.',
      priority: 2,
    });
  }

  // Rule 5: Weekend vs weekday spending
  let weekdaySpend = 0, weekendSpend = 0, weekdayCount = 0, weekendCount = 0;
  monthTxs.filter((t) => t.type === 'expense').forEach((tx) => {
    const day = new Date(tx.date).getDay();
    const amt = Number(tx.amount) || 0;
    if (day === 0 || day === 6) { weekendSpend += amt; weekendCount++; }
    else { weekdaySpend += amt; weekdayCount++; }
  });

  if (weekendCount > 0 && weekdayCount > 0) {
    const avgWeekend = weekendSpend / Math.max(weekendCount, 1);
    const avgWeekday = weekdaySpend / Math.max(weekdayCount, 1);
    if (avgWeekend > avgWeekday * 1.5) {
      insights.push({
        type: 'tip',
        icon: '📊',
        title: 'Weekend Spender',
        message: `Rata-rata pengeluaran akhir pekanmu ${Math.round(avgWeekend / avgWeekday)}x lipat hari biasa. Coba buat budget weekend.`,
        priority: 3,
      });
    }
  }

  // Rule 6: Goal progress
  goals.forEach((goal) => {
    if (goal.targetAmount > 0) {
      const pct = Math.round((goal.savedAmount / goal.targetAmount) * 100);
      if (pct >= 50 && pct < 100) {
        const remaining = goal.targetAmount - goal.savedAmount;
        insights.push({
          type: 'success',
          icon: '🎯',
          title: `${goal.name} Setengah Jalan!`,
          message: `Sudah ${pct}% menuju target. Tinggal Rp ${remaining.toLocaleString('id-ID')} lagi!`,
          priority: 4,
        });
      }
      if (pct >= 100) {
        insights.push({
          type: 'success',
          icon: '🏆',
          title: `${goal.name} Tercapai!`,
          message: `Selamat! Kamu berhasil mencapai target "${goal.name}"! 🎉`,
          priority: 1,
        });
      }
    }
  });

  // Rule 7: Empty state — no transactions
  if (transactions.length === 0) {
    insights.push({
      type: 'info',
      icon: '🌱',
      title: 'Mulai Perjalananmu',
      message: 'Catat transaksi pertamamu untuk mulai mendapatkan insight keuangan!',
      priority: 1,
    });
  }

  return insights.sort((a, b) => a.priority - b.priority);
}
