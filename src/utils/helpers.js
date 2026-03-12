/**
 * Format number as Indonesian Rupiah
 */
export const formatIDR = (amount) => {
  const num = Number(amount) || 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

/**
 * Format date to display string
 */
export const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Format date to ISO date string (YYYY-MM-DD)
 */
export const toISODate = (date = new Date()) => {
  return date.toISOString().split('T')[0];
};

/**
 * Get month name in Indonesian
 */
export const getMonthName = (month) => {
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  return months[month];
};

/**
 * Category icon mapping
 */
export const categoryIcons = {
  'Makanan': '🍜',
  'Transportasi': '🚌',
  'Hiburan': '🎬',
  'Belanja': '🛍️',
  'Internet': '🌐',
  'Pendidikan': '📚',
  'Kesehatan': '💊',
  'Tagihan': '📄',
  'Lainnya': '💰',
  'Gaji': '💼',
  'Hadiah': '🎁',
  'Investasi': '📈',
  'Freelance': '💻',
};

/**
 * Expense categories
 */
export const expenseCategories = [
  'Makanan', 'Transportasi', 'Hiburan', 'Belanja',
  'Internet', 'Pendidikan', 'Kesehatan', 'Tagihan', 'Lainnya',
];

/**
 * Income categories
 */
export const incomeCategories = [
  'Gaji', 'Hadiah', 'Investasi', 'Freelance', 'Lainnya',
];

/**
 * Plant stage emoji mapping
 */
export const plantEmojis = {
  seed: '🌰',
  sprout: '🌱',
  plant: '🌿',
  tree: '🌳',
  blossom: '🌸',
};

/**
 * Badge definitions
 */
export const badgeDefinitions = {
  streak_7: { name: '7 Hari Berturut', icon: '🍃', description: 'Catat transaksi 7 hari berturut-turut' },
  streak_30: { name: 'Sebulan Penuh', icon: '🌻', description: 'Catat transaksi 30 hari berturut-turut' },
  level_5: { name: 'Tukang Kebun', icon: '🏅', description: 'Capai level 5' },
  first_goal: { name: 'Pemimpi', icon: '🎯', description: 'Buat target menabung pertama' },
  goal_50: { name: 'Setengah Jalan', icon: '🌟', description: 'Capai 50% target menabung' },
  goal_100: { name: 'Target Tercapai', icon: '🏆', description: 'Capai 100% target menabung' },
};
