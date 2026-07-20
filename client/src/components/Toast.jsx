import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const bgColors = {
    success: 'bg-emerald-50 border-emerald-500 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-600',
    error: 'bg-rose-50 border-rose-500 text-rose-800 dark:bg-rose-950/80 dark:text-rose-200 dark:border-rose-600',
    info: 'bg-blue-50 border-blue-500 text-blue-800 dark:bg-blue-950/80 dark:text-blue-200 dark:border-blue-600',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />,
  };

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl transition-all transform duration-300 ${bgColors[type] || bgColors.info}`}>
      {icons[type]}
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
