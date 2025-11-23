// src/components/OfferOverlay.tsx
import React from "react";
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
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-3 sm:px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-5xl"
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="pointer-events-none absolute -inset-[12px] rounded-[30px] bg-gradient-to-r from-amber-400/35 via-orange-500/35 to-blue-500/35 blur-3xl opacity-90" />

            <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-slate-950 text-white shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
              <button
                onClick={onClose}
                aria-label="Close offer"
                className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white transition hover:scale-105 hover:bg-black/70"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute inset-0">
                <img
                  src={imageSrc}
                  alt="PrimoBoostAI offer"
                  className={`h-full w-full object-${fit}`}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-slate-900/75 to-slate-900/35" />
                <div className="absolute inset-0 mix-blend-screen opacity-70 bg-[radial-gradient(circle_at_15%_25%,rgba(255,255,255,0.14),transparent_35%),radial-gradient(circle_at_80%_15%,rgba(59,130,246,0.25),transparent_32%),radial-gradient(circle_at_18%_85%,rgba(251,191,36,0.22),transparent_28%)]" />
              </div>

              <div className="relative grid items-center gap-6 p-6 sm:p-8 lg:p-10 md:grid-cols-[1.05fr_0.95fr]">
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-md">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-300" />
                    <span>PrimoBoost AI Optimizer</span>
                  </div>

                  <h3 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                    Your Resume Isn't Getting Shortlisted?
                    <span className="block text-white/90">Fix it in 60 Seconds.</span>
                  </h3>

                  <p className="text-base text-white/80 sm:text-lg max-w-xl">
                    ATS score, missing keywords, weak projects - PrimoBoost AI finds and fixes everything before recruiters ever see your resume.
                  </p>

                  <div className="flex flex-wrap gap-3 text-sm text-white/75">
                    {[
                      "Instant ATS score",
                      "Keyword gap fixes",
                      "Project rewriting",
                      "Tailored to any JD"
                    ].map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/15 bg-white/10 px-3 py-1 backdrop-blur-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <motion.button
                      whileHover={{ y: -2, scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleActionClick}
                      className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-900 shadow-lg shadow-blue-500/20 transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                    >
                      {ctaLabel}
                      <span className="ml-2 text-sm text-slate-600">-> Open Optimizer</span>
                    </motion.button>

                    <button
                      onClick={onClose}
                      className="text-sm font-semibold text-white/70 transition hover:text-white"
                    >
                      Not now
                    </button>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="relative rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-md shadow-xl"
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
                      <p className="font-semibold text-white">What you get</p>
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
