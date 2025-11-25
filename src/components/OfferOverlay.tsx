// src/components/OfferOverlay.tsx
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface OfferOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onAction?: () => void;
  targetPath?: string;
  ctaLabel?: string;
  imageSrc?: string;
  fit?: "cover" | "contain";
}

export const OfferOverlay: React.FC<OfferOverlayProps> = ({
  isOpen,
  onClose,
  onAction,
  targetPath = "/optimizer",
  imageSrc = "https://img.sanishtech.com/u/d3c3a0693f8dfeff84478ac6f4b44977.png",
  ctaLabel = "Optimize Resume Now",
  fit = "cover"
}) => {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 550);
    return () => clearTimeout(timer);
  }, []);

  const handleActionClick = () => {
    if (onAction) {
      onAction();
    } else {
      navigate(targetPath);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && ready && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/45 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-[92vw] sm:max-w-3xl lg:max-w-5xl max-h-[60vh] sm:max-h-[66vh]"
            initial={{ opacity: 0, y: 36, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 26, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="pointer-events-none absolute -inset-[10px] rounded-[22px] bg-gradient-to-r from-amber-400/35 via-orange-500/35 to-blue-500/35 blur-3xl opacity-80" />

            <div className="relative overflow-hidden rounded-[20px] border border-white/10 bg-slate-950 text-white shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
              <div className="absolute inset-0">
                <img
                  src={imageSrc}
                  alt="PrimoBoostAI offer"
                  className={`h-full w-full object-${fit}`}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950/75 via-slate-900/65 to-slate-900/35" />
                <div className="absolute inset-0 mix-blend-screen opacity-70 bg-[radial-gradient(circle_at_15%_25%,rgba(255,255,255,0.14),transparent_35%),radial-gradient(circle_at_80%_15%,rgba(59,130,246,0.25),transparent_32%),radial-gradient(circle_at_18%_85%,rgba(251,191,36,0.22),transparent_28%)]" />
              </div>

              <div className="relative grid items-start gap-6 p-5 sm:p-6 lg:p-8 md:grid-cols-[1.05fr_0.95fr]">
                <div className="relative rounded-xl bg-slate-950/70 p-4 sm:p-5 md:bg-transparent md:p-0 md:backdrop-blur-none">
                  <div className="flex items-start justify-between gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs sm:text-sm font-semibold backdrop-blur-md">
                      <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-300" />
                      <span>PrimoBoost AI Optimizer</span>
                    </div>
                    <button
                      onClick={onClose}
                      aria-label="Close offer"
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white transition hover:scale-105 hover:bg-black/60"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <h3 className="mt-4 text-[22px] sm:text-[26px] font-bold leading-tight">
                    Your Resume Isn't Getting Shortlisted?
                    <span className="block text-white/90">Fix it in 60 Seconds.</span>
                  </h3>

                  <p className="mt-3 text-sm sm:text-base text-white/80 leading-relaxed max-w-xl">
                    ATS score, missing keywords, weak projects - PrimoBoost AI finds and fixes everything before recruiters ever see your resume.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2.5 text-sm text-white/80">
                    {[
                      "Instant ATS score",
                      "Keyword gap fixes",
                      "Project rewriting",
                      "Tailored to any JD"
                    ].map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <motion.button
                      whileHover={{ y: -2, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleActionClick}
                      className="btn-primary w-full sm:w-auto h-12 px-6 rounded-xl text-base"
                    >
                      {ctaLabel}
                      <span className="ml-2 text-sm text-white/90">&#8594; Open Optimizer</span>
                    </motion.button>

                    <button
                      onClick={onClose}
                      className="text-sm font-semibold text-white/80 transition hover:text-white h-11"
                    >
                      Not now
                    </button>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="relative rounded-2xl border border-white/10 bg-white/10 p-5 sm:p-6 backdrop-blur-md shadow-xl"
                >
                  <div className="space-y-3 text-sm text-white/80">
                    <div className="flex items-center justify-between">
                      <span>ATS Score Boost</span>
                      <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-200">
                        +25 pts avg
                      </span>
                    </div>
                    <hr className="border-white/10" />
                    <div>
                      <p className="font-semibold text-white text-base">What you get</p>
                      <ul className="mt-2 space-y-2">
                        {[
                          "Instant JD-based tailoring",
                          "Keyword density fixes",
                          "Project impact rewrites",
                          "Recruiter-ready formatting"
                        ].map((line) => (
                          <li key={line} className="flex items-start gap-2">
                            <span className="mt-1 h-2 w-2 rounded-full bg-blue-300" />
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-amber-400 via-orange-500 to-blue-500" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
