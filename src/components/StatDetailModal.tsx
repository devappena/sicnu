import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../hooks/useTheme';

interface StatDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function StatDetailModal({ isOpen, onClose, title, children }: StatDetailModalProps) {
  const { isDarkMode } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal */}
        <div className={`
          inline-block w-full max-w-4xl px-6 py-6 my-8 text-left align-middle transition-all transform
          ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}
          border rounded-xl shadow-xl sm:align-middle
        `}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {title}
            </h3>
            <button
              onClick={onClose}
              className={`
                p-2 rounded-lg transition-colors
                ${isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}
              `}
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
