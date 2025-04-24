import React from 'react';
import { FiX, FiAlertTriangle } from 'react-icons/fi';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action', 
  message = 'Are you sure you want to proceed with this action?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning' // 'warning', 'danger', 'info'
}) => {
  if (!isOpen) return null;

  const getButtonStyle = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-500/20 text-red-400 hover:bg-red-500/40 hover:text-red-300';
      case 'warning':
        return 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/40 hover:text-amber-300';
      case 'info':
        return 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/40 hover:text-blue-300';
      default:
        return 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/40 hover:text-emerald-300';
    }
  };

  const getIconStyle = () => {
    switch (type) {
      case 'danger':
        return 'text-red-400';
      case 'warning':
        return 'text-amber-400';
      case 'info':
        return 'text-blue-400';
      default:
        return 'text-emerald-400';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative w-full max-w-md bg-[#1A1E23] rounded-xl shadow-xl border border-gray-700/40">
        <div className="p-6">
          <div className="flex items-start">
            <div className={`p-2 rounded-full ${getIconStyle()} bg-opacity-20 mr-4`}>
              <FiAlertTriangle size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
              <p className="text-gray-300">{message}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-gray-700/40 text-gray-300 hover:bg-gray-600/60 hover:text-white transition-colors"
            >
              <FiX size={16} />
            </button>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-700/40 text-gray-300 hover:bg-gray-600/60 hover:text-white transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 rounded-lg transition-colors ${getButtonStyle()}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
