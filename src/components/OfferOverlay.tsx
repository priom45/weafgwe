// src/components/OfferOverlay.tsx
import React from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

type OverlayMode = "resume" | "mock";

interface OfferOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onAction?: () => void;
  targetPath?: string;

  // prevent wrong CTA mixing
  mode?: OverlayMode;

  // optional overrides
  headline?: string;
  subline?: string;
  footnote?: string;
  imageSrc?: string;

  // if parent passes, still we sanitize based on mode
  ctaLabel?: string;
}

export const OfferOverlay: React.FC<OfferOverlayProps> = ({
  isOpen,
  onClose,
  onAction,
  targetPath = "/resume-optimizer",
  mode = "resume",

  headline,
  subline,
  footnote,
  imageSrc = "https://image2url.com/images/1763786298323-c7018241-3539-4f2b-b0d9-565783e934ef.png",
  ctaLabel,
}) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  // ✅ Option 1 promo defaults
  const resumeDefaults = {
    headline: "🚀 Your Resume Isn’t Getting Shortlisted? Fix it in 60 Seconds.",
    subline:
      "ATS score, missing keywords, weak projects — PrimoBoostAI finds + fixes everything.",
    footnote: "🔥 Limited free credits today.",
    cta: "Optimize Resume Now",
    path: "/resume-optimizer",
  };

  const mockDefaults = {
    headline: "🎤 Crack Communication & Mock Interviews Fast.",
    subline: "Practice real interview patterns with AI feedback.",
    footnote: "🔥 Free mock credits today.",
    cta: "Start Mock Interview Now",
    path: "/mock-interview",
  };

  const config = mode === "mock" ? mockDefaults : resumeDefaults;

  const finalHeadline = headline ?? config.headline;
  const finalSubline = subline ?? config.subline;
  const finalFootnote = footnote ?? config.footnote;

  // ✅ sanitize CTA so mock CTA never shows in resume mode
  const finalCtaLabel =
    mode === "resume"
      ? (ctaLabel && !ctaLabel.toLowerCase().includes("mock")
          ? ctaLabel
          : config.cta)
      : ctaLabel ?? config.cta;

  const finalTargetPath = targetPath ?? config.path;

  const handleActionClick = () => {
    if (onAction) onAction();
    else if (finalTargetPath) navigate(finalTargetPath);
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
      <div className="relative w-full max-w-3xl">
        {/* cinematic glow */}
        <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-r from-yellow-400/20 via-orange-500/20 to-blue-500/20 blur-2xl opacity-80" />

        <div className="relative bg-white dark:bg-dark-100 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-dark-300">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-20 p-2 rounded-full bg-gray-900/60 text-white hover:bg-gray-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Clickable banner */}
          <div
            role="button"
            tabIndex={0}
            onClick={handleActionClick}
            onKeyDown={onKeyActivate}
            className="relative cursor-pointer group"
            aria-label="Open Offer Target"
          >
            <img
              src={imageSrc}
              alt="PrimoBoostAI Offer"
              className="w-full h-72 sm:h-80 object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />

            {/* gradient + content */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10">
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
                <h2 className="text-white text-2xl sm:text-3xl font-extrabold leading-snug drop-shadow">
                  {finalHeadline}
                </h2>

                <p className="mt-2 text-white/90 text-sm sm:text-base leading-relaxed max-w-2xl">
                  {finalSubline}
                </p>

                {/* ✅ CTA as TEXT only (no button UI) */}
                <div className="mt-5 inline-flex items-center gap-2 text-white font-semibold text-base sm:text-lg">
                  <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
                    {finalCtaLabel}
                  </span>
                  <span className="text-white/70 text-sm sm:text-base">
                    → opens optimizer
                  </span>
                </div>

                <div className="mt-4 text-orange-300 font-bold text-sm sm:text-base">
                  {finalFootnote}
                </div>
              </div>
            </div>
          </div>

          {/* premium strip */}
          <div className="h-1 w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-blue-500" />
        </div>
      </div>
    </div>
  );
};
