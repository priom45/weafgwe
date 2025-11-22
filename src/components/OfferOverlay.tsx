// src/components/OfferOverlay.tsx
import React from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OfferOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onAction?: () => void;
  targetPath?: string;
  ctaLabel?: string;

  // optional overrides (if you want later)
  headline?: string;
  subline?: string;
  footnote?: string;
  imageSrc?: string;
}

export const OfferOverlay: React.FC<OfferOverlayProps> = ({
  isOpen,
  onClose,
  onAction,
  targetPath = "/resume-optimizer",
  ctaLabel = "Tap to Optimize Now",
  headline = "🚀 Your Resume Isn’t Getting Shortlisted? Fix it in 60 Seconds.",
  subline = "ATS score, missing keywords, weak projects — PrimoBoostAI finds + fixes everything.",
  footnote = "🔥 Limited free credits today.",
  imageSrc = "/mnt/data/A_promotional_digital_overlay_digital_image_is_dis.png",
}) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  const handleActionClick = () => {
    if (onAction) onAction();
    else if (targetPath) navigate(targetPath);
    onClose();
  };

  const onKeyActivate: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleActionClick();
    }
  };

  return (
    <div className="fixed inset-0 z-50 p-4 sm:p-6 bg-black/75 backdrop-blur-md flex items-center justify-center animate-fade-in-down">
      {/* Outer glow for cinematic feel */}
      <div className="relative w-full max-w-3xl">
        <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-r from-yellow-400/20 via-orange-500/20 to-blue-500/20 blur-2xl opacity-80" />

        <div className="relative bg-white dark:bg-dark-100 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-dark-300">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-20 p-2 rounded-full bg-gray-900/60 text-white hover:bg-gray-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Clickable Banner */}
          <div
            role="button"
            tabIndex={0}
            onClick={handleActionClick}
            onKeyDown={onKeyActivate}
            className="relative cursor-pointer group"
            aria-label="Open Resume Optimizer"
          >
            <img
              src={imageSrc}
              alt="PrimoBoostAI Offer Overlay"
              className="w-full h-72 sm:h-80 object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />

            {/* Cinematic gradient + content */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10">
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
                {/* Headline */}
                <h2 className="text-white text-2xl sm:text-3xl font-extrabold leading-snug drop-shadow">
                  {headline}
                </h2>

                {/* Subline */}
                <p className="mt-2 text-white/90 text-sm sm:text-base leading-relaxed max-w-2xl">
                  {subline}
                </p>

                {/* Text CTA (NOT a button type) */}
                <div className="mt-5 inline-flex items-center gap-2 text-white font-semibold text-base sm:text-lg">
                  <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
                    {ctaLabel}
                  </span>
                  <span className="text-white/70 text-sm sm:text-base">
                    → opens optimizer
                  </span>
                </div>

                {/* Footnote */}
                <div className="mt-4 text-orange-300 font-bold text-sm sm:text-base">
                  {footnote}
                </div>
              </div>
            </div>
          </div>

          {/* Optional small bottom strip for extra premium look */}
          <div className="h-1 w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-blue-500" />
        </div>
      </div>
    </div>
  );
};
