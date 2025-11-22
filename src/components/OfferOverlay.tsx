// src/components/OfferOverlay.tsx
import React, { useState } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OfferOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onAction?: () => void;
  targetPath?: string;

  imageSrc: string;

  // If image already contains text (your case) keep false
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
  const [imgFailed, setImgFailed] = useState(false);

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

  const fitClass = fit === "cover" ? "object-cover" : "object-contain";

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in-down">
      <div className="relative w-full max-w-4xl">
        {/* cinematic glow */}
        <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-r from-yellow-400/20 via-orange-500/20 to-blue-500/20 blur-2xl opacity-80" />

        <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Clickable banner box */}
          <div
            role="button"
            tabIndex={0}
            onClick={handleActionClick}
            onKeyDown={onKeyActivate}
            className="relative cursor-pointer group w-full min-h-[260px] sm:min-h-[320px] md:min-h-[380px]"
            aria-label="Open Offer Target"
          >
            {/* ✅ Reserve height always + image fill */}
            {!imgFailed ? (
              <img
                src={imageSrc}
                alt="PrimoBoostAI Offer"
                className={`absolute inset-0 w-full h-full ${fitClass}`}
                onError={() => setImgFailed(true)}
                loading="eager"
                draggable={false}
              />
            ) : (
              // ✅ fallback if image fails to load
              <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
            )}

            {/* bottom readability fade */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* CTA + footnote (inside banner) */}
            <div className="absolute bottom-5 left-5 sm:bottom-7 sm:left-7 z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white font-semibold backdrop-blur-sm">
                {ctaLabel}
                <span className="text-white/60 text-sm">→ opens optimizer</span>
              </div>

              <div className="mt-3 text-orange-300 font-bold text-sm sm:text-base">
                {footnote}
              </div>
            </div>

            {/* OPTIONAL text overlay only when needed */}
            {showTextOverlay && (
              <div className="absolute inset-0 z-10 flex flex-col justify-end p-5 sm:p-7">
                <h2 className="text-white text-2xl sm:text-3xl font-extrabold drop-shadow">
                  {headline}
                </h2>
                <p className="mt-2 text-white/90 text-sm sm:text-base max-w-2xl">
                  {subline}
                </p>
              </div>
            )}
          </div>

          {/* premium strip */}
          <div className="h-1 w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-blue-500" />
        </div>
      </div>
    </div>
  );
};
