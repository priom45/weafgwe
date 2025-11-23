// src/components/OfferOverlay.tsx
import React from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OfferOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onAction?: () => void;
  targetPath?: string;

  imageSrc: string;
  fit?: "cover" | "contain";
}

export const OfferOverlay: React.FC<OfferOverlayProps> = ({
  isOpen,
  onClose,
  onAction,
  targetPath = "/optimizer",

  imageSrc = "https://img.sanishtech.com/u/d3c3a0693f8dfeff84478ac6f4b44977.png",
  fit = "cover"
}) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  const handleActionClick = () => {
    if (onAction) onAction();
    else navigate(targetPath);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-lg flex items-center justify-center p-3 sm:p-6 animate-fade-in-down">
      <div className="relative w-full max-w-4xl">

        {/* Outer Glow */}
        <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-r from-yellow-400/20 via-orange-500/20 to-blue-500/20 blur-2xl opacity-80" />

        <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black">

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-30 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Clickable Area */}
          <div
            role="button"
            tabIndex={0}
            onClick={handleActionClick}
            className="relative cursor-pointer"
          >
            {/* Banner Image */}
            <img
              src={imageSrc}
              alt="PrimoBoostAI Banner"
              className={`w-full h-auto max-h-[85vh] object-${fit}`}
            />

            {/* Bottom CTA */}
            <div className="absolute bottom-8 left-8 z-30">
              <div className="inline-flex items-center gap-2 px-6 py-3 
                rounded-full bg-white/15 backdrop-blur-md
                border border-white/25 text-white font-semibold text-base">
                Optimize Resume Now
                <span className="text-white/60 text-sm">→ Open Optimizer</span>
              </div>
            </div>
          </div>

          {/* Premium Strip */}
          <div className="h-1 w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-blue-500" />
        </div>
      </div>
    </div>
  );
};
