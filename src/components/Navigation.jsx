import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  BarChart3,
  User,
  Target,
  Sparkles,
} from 'lucide-react';

/* eslint-disable no-unused-vars */

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/transaksi', icon: ArrowLeftRight, label: 'Transaksi' },
  { to: '/dompet', icon: Wallet, label: 'Dompet' },
  { to: '/laporan', icon: BarChart3, label: 'Laporan' },
  { to: '/goals', icon: Target, label: 'Goals' },
  { to: '/insights', icon: Sparkles, label: 'AI Insights' },
  { to: '/profil', icon: User, label: 'Profil' },
];

const mobileNavItems = [
  navItems.find((i) => i.to === '/dashboard'),
  navItems.find((i) => i.to === '/transaksi'),
  navItems.find((i) => i.to === '/dompet'),
  navItems.find((i) => i.to === '/goals'),
  navItems.find((i) => i.to === '/profil'),
];

export function Sidebar() {
  return (
    <aside className="app-sidebar">
      <div className="logo">
        🌿 <span>Zen</span>Finance
      </div>
      <nav className="sidebar-nav">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export function BottomNav() {
  return (
    <div className="bottom-nav">
      <div className="bottom-nav-inner">
        {mobileNavItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={22} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
