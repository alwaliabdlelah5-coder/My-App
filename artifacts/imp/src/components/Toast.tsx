import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';
interface ToastItem { id: string; message: string; type: ToastType; }

const ToastContext = createContext<{ toast: (msg: string, type?: ToastType) => void }>({ toast: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'success') => {
    const id = String(Date.now() + Math.random());
    setToasts(prev => [...prev.slice(-4), { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-6 left-6 z-[200] space-y-3 pointer-events-none" dir="rtl">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div key={t.id}
              initial={{ x: -80, opacity: 0, scale: 0.9 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: -80, opacity: 0, scale: 0.9 }}
              className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl font-bold text-sm pointer-events-auto min-w-[280px] border ${
                t.type === 'success' ? 'bg-emerald-500 text-white border-emerald-400' :
                t.type === 'error' ? 'bg-rose-500 text-white border-rose-400' :
                'bg-gray-900 text-white border-gray-700'
              }`}
            >
              {t.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> :
               t.type === 'error' ? <XCircle className="w-5 h-5 shrink-0" /> :
               <Info className="w-5 h-5 shrink-0" />}
              <span>{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
