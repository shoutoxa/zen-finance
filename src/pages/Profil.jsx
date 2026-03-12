import React, { useState } from "react";
import {
  useUserStore,
  useTransactionStore,
  useWalletStore,
  useGoalStore,
  resetAllData,
} from "../store";
import { plantEmojis } from "../utils/helpers";
import {
  User,
  Download,
  Trash2,
  LogIn,
  AlertTriangle,
  X,
  Heart,
} from "lucide-react";

export default function Profil() {
  const {
    streak,
    level,
    totalXP,
    plantStage,
    badges,
    uid,
    email,
    displayName,
    photoURL,
    loginWithGoogle,
    logout,
    syncToCloud,
  } = useUserStore();
  const levelName = useUserStore((s) => s.getLevelName());
  const transactions = useTransactionStore((s) => s.transactions);
  const wallets = useWalletStore((s) => s.wallets);
  const goals = useGoalStore((s) => s.goals);

  const [showResetModal, setShowResetModal] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState("");

  const handleExport = () => {
    const data = {
      transactions,
      wallets,
      goals,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `zen-finance-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in">
      <h1 className="mb-5">Profil</h1>

      {/* User Card */}
      <div
        className="zen-card flex items-center gap-5 mb-5"
        style={{ padding: "28px" }}
      >
        {photoURL ? (
          <img
            src={photoURL}
            alt="Profile"
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "var(--zen-leaf-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
            }}
          >
            {plantEmojis[plantStage]}
          </div>
        )}
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: "1.25rem" }}>{displayName || levelName}</h2>
          <p className="text-muted text-xs mt-1">
            {email || `Level ${level} · ${totalXP} XP`}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="zen-badge zen-badge-sun">🔥 {streak} hari</span>
            <span className="zen-badge zen-badge-leaf">
              🏅 {badges.length} badges
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4 mb-5 mobile-flex-col mobile-gap-3">
        <div className="zen-card text-center" style={{ flex: 1 }}>
          <h2 className="text-leaf">{transactions.length}</h2>
          <p className="text-xs text-muted mt-1">Total Transaksi</p>
        </div>
        <div className="zen-card text-center" style={{ flex: 1 }}>
          <h2 className="text-lake">{wallets.length}</h2>
          <p className="text-xs text-muted mt-1">Dompet</p>
        </div>
        <div className="zen-card text-center" style={{ flex: 1 }}>
          <h2 className="text-sun">{goals.length}</h2>
          <p className="text-xs text-muted mt-1">Targets</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        {uid && (
          <button
            className="zen-btn zen-btn-primary zen-btn-block"
            onClick={syncToCloud}
          >
            <Download size={18} /> Sync ke Cloud
          </button>
        )}

        <button
          className="zen-btn zen-btn-outline zen-btn-block"
          onClick={handleExport}
        >
          <Download size={18} /> Backup Data (JSON)
        </button>

        {uid ? (
          <button
            className="zen-btn zen-btn-ghost zen-btn-block"
            onClick={logout}
            style={{ color: "var(--zen-rose)" }}
          >
            <LogIn size={18} /> Logout
          </button>
        ) : (
          <button
            className="zen-btn zen-btn-primary zen-btn-block"
            onClick={loginWithGoogle}
          >
            <LogIn size={18} /> Login dengan Google
          </button>
        )}
      </div>

      {/* Danger Zone */}
      <div
        style={{
          marginTop: "48px",
          paddingTop: "24px",
          borderTop: "1px solid var(--zen-bark-light)",
        }}
      >
        <button
          className="zen-btn zen-btn-outline zen-btn-block"
          style={{ borderColor: "var(--zen-rose)", color: "var(--zen-rose)" }}
          onClick={() => {
            setShowResetModal(true);
            setResetConfirmText("");
          }}
        >
          <Trash2 size={18} /> Reset Semua Data
        </button>
      </div>

      {/* About */}
      <div
        className="zen-card mt-6"
        style={{ background: "var(--zen-leaf-light)", textAlign: "center" }}
      >
        <p style={{ fontSize: "1.5rem", marginBottom: "4px" }}>🌿</p>
        <p className="font-display font-bold" style={{ fontSize: "1.125rem" }}>
          Zen Finance
        </p>
        <p className="text-xs text-muted mt-1">v1.0 MVP · Offline-First PWA</p>
        <p className="text-xs text-muted">Keuanganmu, taman yang tumbuh.</p>
      </div>

      {/* Reset Modal */}
      {showResetModal && (
        <div
          className="zen-modal-overlay"
          onClick={() => setShowResetModal(false)}
        >
          <div
            className="zen-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "400px", textAlign: "center" }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "var(--zen-rose-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <AlertTriangle size={32} color="var(--zen-rose)" />
            </div>
            <h2 className="mb-2 w-full text-center">Reset Semua Data?</h2>
            <p className="text-muted mb-4 text-sm">
              Tindakan ini akan{" "}
              <strong>
                menghapus seluruh data dompet, transaksi, target, dan progres
                profilmu secara permanen
              </strong>{" "}
              di perangkat ini. Tindakan ini tidak bisa dibatalkan.
            </p>

            <div className="mb-6 text-left">
              <label className="zen-label text-xs">
                Untuk melanjutkan, ketik "HAPUS" di bawah ini:
              </label>
              <input
                type="text"
                className="zen-input"
                placeholder="HAPUS"
                value={resetConfirmText}
                onChange={(e) => setResetConfirmText(e.target.value)}
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                className="zen-btn zen-btn-outline"
                style={{ flex: 1 }}
                onClick={() => setShowResetModal(false)}
              >
                Batal
              </button>
              <button
                className="zen-btn"
                style={{
                  flex: 1,
                  background:
                    resetConfirmText === "HAPUS"
                      ? "var(--zen-rose)"
                      : "var(--zen-bark-light)",
                  color: "white",
                }}
                disabled={resetConfirmText !== "HAPUS"}
                onClick={resetAllData}
              >
                Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
