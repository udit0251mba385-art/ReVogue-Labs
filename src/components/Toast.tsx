import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#1E3F20] text-[#F7F5EE] border border-[#C2F04E]/30 rounded-lg p-3.5 shadow-xl flex items-start gap-3 transition-all duration-200"
        >
          <CheckCircle2 className="w-5 h-5 text-[#C2F04E] shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold font-sans text-white">{toast.title}</h4>
            <p className="text-[11px] text-[#ECE8DC] mt-0.5 leading-relaxed">{toast.description}</p>
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-[#ECE8DC]/70 hover:text-white p-0.5 cursor-pointer"
            aria-label="Dismiss toast"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
