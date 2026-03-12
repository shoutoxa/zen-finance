import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar, BottomNav } from './components/Navigation';
import Toast from './components/Toast';
import Dashboard from './pages/Dashboard';
import Transaksi from './pages/Transaksi';
import Dompet from './pages/Dompet';
import Laporan from './pages/Laporan';
import Goals from './pages/Goals';
import Insights from './pages/Insights';
import Profil from './pages/Profil';
import './index.css';

function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        {children}
      </main>
      <BottomNav />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transaksi" element={<Transaksi />} />
          <Route path="/dompet" element={<Dompet />} />
          <Route path="/laporan" element={<Laporan />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/profil" element={<Profil />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}
