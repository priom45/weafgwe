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

  showTextOverlay?: boolean;

  headline?: string;
  subline?: string;
  footnote?: string;

  ctaLabel?: string;

  fit?: "cover" | "contain";
}

export const OfferOverlay: React.FC<OfferOverlayProps> = ({
  isOpen,
  onClose,
  onAction,
  targetPath = "/resume-optimizer",

  imageSrc,

  showTextOverlay = false,
  headline = "🚀 Your Resume Isn’t Getting Shortlisted? Fix it in 60 Seconds.",
  subline = "ATS score, missing keywords, weak projects — PrimoBoostAI finds + fixes everything.",
  footnote = "🔥 Limited free credits today.",
  ctaLabel = "Optimize Resume Now",

  fit = "contain",
}) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  const handleActionClick = () => {
    if (onAction) onAction();
    else navigate(targetPath);
    onClose();
  };

  const onKeyActivate: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleActionClick();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-lg flex items-center justify-center p-3 sm:p-6 animate-fade-in-down">
      <div className="relative w-full max-w-4xl">

        {/* Glow Border */}
        <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-r from-yellow-400/20 via-orange-500/20 to-blue-500/20 blur-2xl opacity-80"></div>

        <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black">

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-30 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Clickable Content */}
          <div
            role="button"
            tabIndex={0}
            onClick={handleActionClick}
            onKeyDown={onKeyActivate}
            className="relative cursor-pointer"
            aria-label="Open Optimizer"
          >
            {/* Banner Image */}
            <img
              src={imageSrc}
              alt="PrimoBoostAI Offer"
              className={`w-full h-auto max-h-[80vh] object-${fit} block`}
            />

            {/* Bottom Fade for Text */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* CTA + Footnote */}
            <div className="absolute bottom-6 left-6 z-30">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 
                rounded-full bg-white/15 backdrop-blur-md
                border border-white/25 text-white font-semibold">
                {ctaLabel}
                <span className="text-white/60 text-sm">→ Open Optimizer</span>
              </div>

              <div className="mt-3 text-orange-300 font-bold text-sm sm:text-base">
                {footnote}
              </div>
            </div>

            {/* Optional Text Overlay (if using plain images) */}
            {showTextOverlay && (
              <div className="absolute inset-0 z-20 flex flex-col justify-end p-6">
                <h2 className="text-white text-3xl font-bold drop-shadow-lg">
                  {headline}
                </h2>
                <p className="mt-2 text-white/90 text-sm sm:text-base max-w-2xl">
                  {subline}
                </p>
              </div>
            )}
          </div>

          {/* Premium Strip */}
          <div className="h-1 w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-blue-500" />
        </div>
      </div>
    </div>
  );
};
