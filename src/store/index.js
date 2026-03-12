import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ========================================
// WALLET STORE
// ========================================
export const useWalletStore = create(
  persist(
    (set, get) => ({
      wallets: [
        { id: 'w1', name: 'Cash', type: 'cash', balance: 0, icon: '💵', color: '#5B8C5A', createdAt: Date.now() },
        { id: 'w2', name: 'Bank', type: 'bank', balance: 0, icon: '🏦', color: '#5B9EA6', createdAt: Date.now() },
      ],

      addWallet: (wallet) => set((s) => ({
        wallets: [...s.wallets, { ...wallet, id: `w${Date.now()}`, createdAt: Date.now() }],
      })),

      updateWallet: (id, data) => set((s) => ({
        wallets: s.wallets.map((w) => w.id === id ? { ...w, ...data } : w),
      })),

      deleteWallet: (id) => set((s) => ({
        wallets: s.wallets.filter((w) => w.id !== id),
      })),

      adjustBalance: (id, amount) => set((s) => ({
        wallets: s.wallets.map((w) =>
          w.id === id ? { ...w, balance: w.balance + amount } : w
        ),
      })),

      getTotalBalance: () => get().wallets.reduce((sum, w) => sum + w.balance, 0),
    }),
    {
      name: 'zen-wallets',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ========================================
// TRANSACTION STORE
// ========================================
export const useTransactionStore = create(
  persist(
    (set, get) => ({
      transactions: [],

      addTransaction: (tx) => set((s) => ({
        transactions: [
          { ...tx, id: `tx${Date.now()}_${Math.random().toString(36).slice(2)}`, createdAt: Date.now() },
          ...s.transactions,
        ],
      })),

      updateTransaction: (id, data) => set((s) => ({
        transactions: s.transactions.map((t) => t.id === id ? { ...t, ...data } : t),
      })),

      deleteTransaction: (id) => set((s) => ({
        transactions: s.transactions.filter((t) => t.id !== id),
      })),

      getByMonth: (year, month) => {
        return get().transactions.filter((tx) => {
          const d = new Date(tx.date);
          return d.getFullYear() === year && d.getMonth() === month;
        });
      },

      getMonthlyTotals: (year, month) => {
        const txs = get().getByMonth(year, month);
        let income = 0, expense = 0, savings = 0;
        txs.forEach((tx) => {
          const amt = Number(tx.amount) || 0;
          if (tx.type === 'income') income += amt;
          if (tx.type === 'expense') expense += amt;
          if (tx.type === 'savings') savings += amt;
        });
        return { income, expense, savings };
      },

      getCategoryBreakdown: (year, month) => {
        const txs = get().getByMonth(year, month).filter((t) => t.type === 'expense');
        const map = {};
        txs.forEach((tx) => {
          const cat = tx.category || 'Lainnya';
          map[cat] = (map[cat] || 0) + (Number(tx.amount) || 0);
        });
        return Object.entries(map)
          .sort((a, b) => b[1] - a[1])
          .map(([name, amount]) => ({ name, amount }));
      },
    }),
    {
      name: 'zen-transactions',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ========================================
// GOALS STORE
// ========================================
export const useGoalStore = create(
  persist(
    (set) => ({
      goals: [],

      addGoal: (goal) => set((s) => ({
        goals: [...s.goals, { ...goal, id: `g${Date.now()}`, savedAmount: 0, createdAt: Date.now() }],
      })),

      updateGoal: (id, data) => set((s) => ({
        goals: s.goals.map((g) => g.id === id ? { ...g, ...data } : g),
      })),

      addSavings: (id, amount) => set((s) => ({
        goals: s.goals.map((g) =>
          g.id === id ? { ...g, savedAmount: g.savedAmount + amount } : g
        ),
      })),

      deleteGoal: (id) => set((s) => ({
        goals: s.goals.filter((g) => g.id !== id),
      })),
    }),
    {
      name: 'zen-goals',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ========================================
// USER / GAMIFICATION STORE
// ========================================
import { auth, provider, signInWithPopup, signOut, db, doc, setDoc, getDoc } from '../services/firebase';

export const useUserStore = create(
  persist(
    (set, get) => ({
      streak: 0,
      lastLogDate: null,
      level: 1,
      totalXP: 0,
      badges: [],
      plantStage: 'seed',
      
      // Auth state
      uid: null,
      email: null,
      displayName: null,
      photoURL: null,
      lastSyncDate: null,

      loginWithGoogle: async () => {
        try {
          const result = await signInWithPopup(auth, provider);
          const user = result.user;
          set({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
          });
          useToastStore.getState().addToast(`Selamat datang, ${user.displayName}!`, 'success');
          // Automatically pull data on login if exists
          await get().pullFromCloud();
        } catch (error) {
          useToastStore.getState().addToast('Gagal login dengan Google', 'error');
          console.error(error);
        }
      },

      logout: async () => {
        try {
          await signOut(auth);
          set({ uid: null, email: null, displayName: null, photoURL: null, lastSyncDate: null });
          useToastStore.getState().addToast('Berhasil logout', 'info');
        } catch (error) {
          console.error(error);
        }
      },

      syncToCloud: async () => {
        const { uid } = get();
        if (!uid) return;

        try {
          const wallets = useWalletStore.getState().wallets;
          const transactions = useTransactionStore.getState().transactions;
          const goals = useGoalStore.getState().goals;
          
          const gamification = {
            streak: get().streak,
            lastLogDate: get().lastLogDate,
            level: get().level,
            totalXP: get().totalXP,
            badges: get().badges,
            plantStage: get().plantStage
          };

          await setDoc(doc(db, 'users', uid), {
            wallets,
            transactions,
            goals,
            gamification,
            updatedAt: new Date().toISOString()
          });

          set({ lastSyncDate: new Date().toISOString() });
          useToastStore.getState().addToast('Data berhasil di-sync ke Cloud ☁️', 'success');
        } catch (error) {
          console.error(error);
          useToastStore.getState().addToast('Gagal sync data', 'error');
        }
      },

      pullFromCloud: async () => {
        const { uid } = get();
        if (!uid) return;

        try {
          const docRef = doc(db, 'users', uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            // Update other stores
            if (data.wallets) useWalletStore.setState({ wallets: data.wallets });
            if (data.transactions) useTransactionStore.setState({ transactions: data.transactions });
            if (data.goals) useGoalStore.setState({ goals: data.goals });
            // Update this store
            if (data.gamification) {
              set({ ...data.gamification, lastSyncDate: data.updatedAt });
            }
            useToastStore.getState().addToast('Data cloud berhasil dimuat', 'success');
          }
        } catch (error) {
          console.error(error);
          useToastStore.getState().addToast('Gagal memuat data dari Cloud', 'error');
        }
      },

      recordActivity: () => {
        const today = new Date().toISOString().split('T')[0];
        const { lastLogDate, streak } = get();

        if (lastLogDate === today) return;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        const newStreak = lastLogDate === yesterdayStr ? streak + 1 : 1;
        const xpGain = 10 + (newStreak > 1 ? 5 : 0);

        let plantStage = 'seed';
        if (newStreak >= 30) plantStage = 'blossom';
        else if (newStreak >= 14) plantStage = 'tree';
        else if (newStreak >= 7) plantStage = 'plant';
        else if (newStreak >= 3) plantStage = 'sprout';

        const newXP = get().totalXP + xpGain;
        const newLevel = Math.floor(newXP / 100) + 1;

        const newBadges = [...get().badges];
        if (newStreak >= 7 && !newBadges.includes('streak_7')) newBadges.push('streak_7');
        if (newStreak >= 30 && !newBadges.includes('streak_30')) newBadges.push('streak_30');
        if (newLevel >= 5 && !newBadges.includes('level_5')) newBadges.push('level_5');

        set({
          streak: newStreak,
          lastLogDate: today,
          totalXP: newXP,
          level: newLevel,
          plantStage,
          badges: newBadges,
        });

        // Auto-sync if logged in
        if (get().uid) {
           get().syncToCloud();
        }
      },

      getLevelName: () => {
        const { level } = get();
        if (level >= 20) return 'Master Garden';
        if (level >= 10) return 'Ahli Botani';
        if (level >= 5) return 'Tukang Kebun';
        return 'Pemula';
      },
    }),
    {
      name: 'zen-user',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ========================================
// TOAST STORE (non-persisted)
// ========================================
export const useToastStore = create((set) => ({
  toasts: [],

  addToast: (message, type = 'success') => {
    const id = Date.now();
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },
}));

// ========================================
// GLOBAL RESET
// ========================================
export const resetAllData = () => {
  localStorage.removeItem('zen-wallets');
  localStorage.removeItem('zen-transactions');
  localStorage.removeItem('zen-goals');
  localStorage.removeItem('zen-user');
  window.location.reload();
};
