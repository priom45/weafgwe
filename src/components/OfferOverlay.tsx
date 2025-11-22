// src/components/OfferOverlay.tsx
import React from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OfferOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onAction?: () => void;
  targetPath?: string;
  ctaLabel?: string;
}

export const OfferOverlay: React.FC<OfferOverlayProps> = ({
  isOpen,
  onClose,
  onAction,
  targetPath = '/resume-optimizer',
  ctaLabel = 'Optimize Resume Now',
}) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  const handleActionClick = () => {
    if (onAction) onAction();
    else if (targetPath) navigate(targetPath);
    onClose();
  };

  const onKeyActivate: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleActionClick();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in-down">
      <div className="relative bg-white dark:bg-dark-100 rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden border border-gray-200 dark:border-dark-300">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-gray-800/60 text-white hover:bg-gray-700 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Banner */}
        <div
          role="button"
          tabIndex={0}
          onClick={handleActionClick}
          onKeyDown={onKeyActivate}
          className="relative cursor-pointer group"
        >
          <img
            src="https://image2url.com/images/1763786298323-c7018241-3539-4f2b-b0d9-565783e934ef.png"
            alt="PrimoBoostAI JD Resume Optimizer Offer"
            className="w-full h-64 sm:h-72 object-cover brightness-100 transition-transform duration-500 group-hover:scale-105"
          />

          {/* Soft gradient only for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex items-end justify-center pb-8">
            <button
              onClick={handleActionClick}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold py-3 px-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              {ctaLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
