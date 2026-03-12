<div align="center">

# 🌿 Zen Finance

**Keuanganmu, taman yang tumbuh.**

![Zen Finance Preview](https://img.shields.io/badge/Status-Active-success)
![Version](https://img.shields.io/badge/Version-1.0_ProMax-blue)
![PWA](https://img.shields.io/badge/PWA-Supported-orange)
![License](https://img.shields.io/badge/License-MIT-green)

Aplikasi manajemen keuangan pribadi yang intuitif dan _mindful_, dilengkapi gamifikasi unik untuk membangun kebiasaan mencatat finansial harian secara _fun_.

Dikembangkan secara khusus menggunakan eksekusi Agentic AI (_Vibecoding_) untuk ajang bergengsi: **Vibecoding Competition Ramadhan 2026**.

[**Coba Live Demo di Sini!**](https://zen-finance-fe071.web.app/)

</div>

---

## Fitur Utama (Features)

1. **UI/UX "Luminescent Organic FinTech" (Vibe Pro Max)**
   Mengadopsi antarmuka kelas dunia dengan efek *glassmorphism* (kaca buram iOS), *ambient radial gradient* yang menenangkan, *diffuse shadows*, dan interaksi *micro-hover* dinamis yang dikerjakan 100% oleh Agent AI.
2. **Manajemen Dompet (Wallets)**
   Kelola berbagai sumber dana (Tunai, Rekening Bank, E-Wallet) dalam satu tempat dengan sistem *currency formatting* otomatis (Rp 1.000.000).
3. **Pencatatan Transaksi**
   Catat pemasukan (Income), pengeluaran (Expense), dan tabungan (Savings) dengan klasifikasi kategori dan laporan grafis bulanan.
4. **Target Tabungan (Goals)**
   Tentukan tujuan finansial (Dana Darurat, Gadget Baru, Liburan) dan pantau progresnya secara visual.
5. **Gamifikasi & Streak Harian**
   Mencatat transaksi secara konsisten akan memelihara tanaman virtual Anda mulai dari benih (Seed) hingga pohon mekar (Blossom). Dapatkan XP, Badges eksklusif, dan tingkatkan *Level* Anda!
6. **Offline-First PWA**
   Aplikasi tetap dapat dibuka dan digunakan dengan lancar walau tanpa koneksi internet berkat teknologi *IndexedDB*.
7. **Cloud Sync (Firebase)**
   Dukungan sinkronisasi data antar perangkat secara aman menggunakan akun Google, atau ekspor utuh data keuangan Anda sebagai JSON.

---

## Tech Stack

- **Frontend & UI Layer:** React 19, Vite, React Router DOM, Custom UI CSS System (`index.css`), Lucide React Icons.
- **State Management:** Zustand (State persist on local storage), IDB Keyval.
- **Data Visualization:** Chart.js & React-Chartjs-2.
- **Backend Service (Cloud Sync & Auth):** Firebase Authentication, Firestore, Analytics.
- **PWA Configuration:** Vite PWA Plugin.
- **Code Quality:** ESLint Validation (Zero Bugs & Warnings).

---

## Cara Menjalankan Berkas Lokal (Local Run)

Proyek ini menggunakan pengelolaan _package_ standard `npm`. Pastikan Node.js (versi terbaru/LTS) sudah terpasang di komputer Anda.

1. **Clone repository ini**

   ```bash
   git clone https://github.com/shoutoxa/zen-finance.git
   cd zen-finance
   ```

2. **Install semua dependensi**

   ```bash
   npm install
   ```

3. **Jalankan aplikasi di Mode Pengembangan (Development)**

   ```bash
   npm run dev
   ```

   Aplikasi dapat diakses via browser localhost, e.g. `http://localhost:5173`.

4. **Kompilasi ke versi Produksi (Build)**
   ```bash
   npm run build
   ```
   _File build hasil transpile Vite akan berada di dalam folder `/dist`._

---

## Vibecoding Competition 2026
Proyek **Zen Finance** didedikasikan secara eksklusif untuk diikutkan dalam perlombaan *Vibecoding Competition Ramadhan 2026* yang menempatkan pengalaman pengembangan produk berbasis Agentic AI ke tataran berikutnya. 

Dari konsep arsitektur, penyelesaian puluhan bug sistem (*linting*), hingga *polishing visual ambient UI* tingkat ekstrem—semuanya dikonduktori melalui prompt *"Code the Vibe"*. Selamat menyambut bulan suci Ramadhan 1447 H!  

<br />

<div align="center">
Dibuat dengan 💚 oleh <b>Shoutoxa</b> dan Agent AI.
</div>
