<div align="center">

# 🌿 Zen Finance
**Keuanganmu, taman yang tumbuh.**

![Zen Finance Preview](https://img.shields.io/badge/Status-Active-success)
![Version](https://img.shields.io/badge/Version-1.0_MVP-blue)
![PWA](https://img.shields.io/badge/PWA-Supported-orange)
![License](https://img.shields.io/badge/License-MIT-green)

Aplikasi manajemen keuangan pribadi yang intuitif dan *mindful*, dilengkapi gamifikasi unik untuk membangun kebiasaan mencatat finansial harian secara *fun*. Dikembangkan dalam rangka **Vibecoding Competition Ramadhan 2026**.

[**Coba Live Demo di Sini!**](https://zen-finance-fe071.web.app/)

</div>

---

## ✨ Fitur Utama (Features)

1. **💸 Manajemen Dompet (Wallets)**
   Kelola berbagai sumber dana (Tunai, Rekening Bank, E-Wallet) dalam satu tempat.
2. **📝 Pencatatan Transaksi**
   Catat pemasukan (Income), pengeluaran (Expense), dan tabungan (Savings) dengan klasifikasi kategori dan laporan grafis bulanan.
3. **🎯 Target Tabungan (Goals)**
   Tentukan tujuan finansial (Dana Darurat, Gadget Baru, Liburan) dan pantau progresnya secara visual.
4. **🪴 Gamifikasi & Streak Harian**
   Mencatat transaksi secara konsisten akan memelihara tanaman virtual Anda mulai dari benih (Seed) hingga pohon mekar (Blossom). Dapatkan XP, Badges, dan naikkan *Level* Anda!
5. **🛜 Offline-First PWA**
   Aplikasi tetap dapat dibuka dan digunakan dengan lancar walau tanpa koneksi internet berkat teknologi *IndexedDB*.
6. **☁️ Cloud Sync (Firebase)**
   Dukungan sinkronisasi data antar perangkat secara aman menggunakan akun Google, atau ekspor utuh data keuangan Anda sebagai JSON.

---

## 💻 Tech Stack

- **Frontend & UI Layer:** React 19, Vite, React Router DOM, Custom UI CSS System (`index.css`), Lucide React Icons.
- **State Management:** Zustand (State persist on local storage), IDB Keyval.
- **Data Visualization:** Chart.js & React-Chartjs-2.
- **Backend Service (Cloud Sync & Auth):** Firebase Authentication, Firestore, Analytics.
- **PWA Configuration:** Vite PWA Plugin.

---

## 🚀 Cara Menjalankan Berkas Lokal (Local Run)

Proyek ini menggunakan pengelolaan *package* standard `npm`. Pastikan Node.js (versi terbaru/LTS) sudah terpasang di komputer Anda.

1. **Clone repository ini**
   ```bash
   git clone https://github.com/username-anda/zen-finance.git
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
   *File build hasil transpile Vite akan berada di dalam folder `/dist`.*

---

## 🎨 Tampilan Pratinjau (Screenshots)

*(Silakan tambahkan tangkapan layar `screenshot.jpg` atau GIF pemakaian aplikasi pada folder repositori Anda, dan tempel link-nya di sini agar pembaca/juri lebih tertarik membedah fitur-fiturnya)*

---

## 🏆 Vibecoding Competition 2026
Proyek **Zen Finance** didedikasikan untuk diikutkan dalam perlombaan *Vibecoding Competition Ramadhan 2026* yang menempatkan pengalaman pengembangan produk berbasis Agentic AI ke tataran berikutnya. Selamat menyambut bulan suci Ramadhan! 🌙✨ 

<br />

<div align="center">
Dibuat dengan 💚 oleh <b>Anda</b> dan Agent AI.
</div>
