import React from 'react';
import { useToastStore } from '../store';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

const iconMap = {
  success: CheckCircle,
  error: AlertTriangle,
  info: Info,
};

const colorMap = {
  success: 'var(--zen-leaf)',
  error: 'var(--zen-rose)',
  info: 'var(--zen-lake)',
};

export default function Toast() {
  const { toasts } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="zen-toast-container">
      {toasts.map((toast) => {
        const Icon = iconMap[toast.type] || Info;
        return (
          <div key={toast.id} className={`zen-toast zen-toast-${toast.type}`}>
            <Icon size={18} color={colorMap[toast.type]} />
            <span style={{ flex: 1 }}>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
}
