// src/components/navigation/PageSidebar.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Target,
  PlusCircle,
  MessageSquare,
  TrendingUp,
  MessageCircle,
  Gamepad2,
  BookOpen,
  Info,
  Phone,
  ChevronRight,
  Briefcase,
  FileText,
  Sparkles,
  CreditCard,
} from 'lucide-react';

// Interfaces
interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  highlight?: boolean; // For special highlighting
}

interface SidebarSection {
  id: string;
  label: string;
  items: SidebarItem[];
}

interface PageSidebarProps {
  currentPath?: string;
}

// Storage key for persistence
const SIDEBAR_STATE_KEY = 'sidebar-expanded';

// Navigation items configuration
const toolsSection: SidebarSection = {
  id: 'tools',
  label: 'Tools',
  items: [
    { id: 'optimizer', label: 'JD-Based Optimizer', icon: <Target className="w-5 h-5" />, path: '/optimizer' },
    { id: 'guided-builder', label: 'Guided Resume Builder', icon: <PlusCircle className="w-5 h-5" />, path: '/guided-builder' },
    { id: 'mock-interview', label: 'AI Mock Interview', icon: <MessageSquare className="w-5 h-5" />, path: '/mock-interview' },
    { id: 'score-checker', label: 'Resume Score Check', icon: <TrendingUp className="w-5 h-5" />, path: '/score-checker' },
    { id: 'linkedin-generator', label: 'Outreach Messages', icon: <MessageCircle className="w-5 h-5" />, path: '/linkedin-generator' },
    { id: 'gaming', label: 'Gaming Aptitude', icon: <Gamepad2 className="w-5 h-5" />, path: '/gaming' },
  ],
};

const pagesSection: SidebarSection = {
  id: 'pages',
  label: 'Explore',
  items: [
    { id: 'jobs', label: 'Explore Jobs', icon: <Briefcase className="w-5 h-5" />, path: '/jobs' },
    { id: 'pricing', label: 'Pricing', icon: <CreditCard className="w-5 h-5" />, path: '/pricing' },
    { id: 'blog', label: 'Blog', icon: <FileText className="w-5 h-5" />, path: '/blog' },
    { id: 'webinars', label: 'Webinars', icon: <Sparkles className="w-5 h-5" />, path: '/webinars' },
    { id: 'tutorials', label: 'Tutorials', icon: <BookOpen className="w-5 h-5" />, path: '/tutorials' },
    { id: 'about', label: 'About Us', icon: <Info className="w-5 h-5" />, path: '/about' },
    { id: 'contact', label: 'Contact Us', icon: <Phone className="w-5 h-5" />, path: '/contact' },
  ],
};

// Animation variants
const sidebarVariants = {
  collapsed: { width: 64 },
  expanded: { width: 240 },
};

const labelVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.03, duration: 0.2 },
  }),
};

// Arrow rotates 180deg when expanded to point left

export const PageSidebar: React.FC<PageSidebarProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    try {
      const saved = sessionStorage.getItem(SIDEBAR_STATE_KEY);
      return saved === 'true';
    } catch {
      return false;
    }
  });
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Check if Christmas season
  const isChristmas = new Date().getMonth() === 11 || new Date().getMonth() === 0;

  // Debug log
  console.log('PageSidebar rendering, isChristmas:', isChristmas);

  // Persist state to session storage
  useEffect(() => {
    try {
      sessionStorage.setItem(SIDEBAR_STATE_KEY, String(isExpanded));
    } catch {
      // Session storage not available
    }
  }, [isExpanded]);

  const toggleSidebar = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => location.pathname === path;

  const renderSidebarItem = (item: SidebarItem, index: number) => {
    const active = isActive(item.path);
    const isHovered = hoveredItem === item.id;
    const isHighlighted = item.highlight && !active;

    return (
      <div key={item.id} className="relative">
        <motion.button
          onClick={() => handleNavigation(item.path)}
          onMouseEnter={() => setHoveredItem(item.id)}
          onMouseLeave={() => setHoveredItem(null)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
            active
              ? isChristmas
                ? 'bg-red-500/20 text-red-400 border-l-2 border-red-400'
                : 'bg-emerald-500/20 text-emerald-400 border-l-2 border-emerald-400'
              : isHighlighted
                ? isChristmas
                  ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border-l-2 border-amber-400'
                  : 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border-l-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="flex-shrink-0">{item.icon}</span>
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                custom={index}
                variants={labelVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="text-sm font-medium whitespace-nowrap overflow-hidden"
              >
                {item.label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Tooltip for collapsed state */}
        <AnimatePresence>
          {!isExpanded && isHovered && (
            <motion.div
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -5 }}
              className={`absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap z-50 ${
                isChristmas
                  ? 'bg-red-900/90 text-red-100 border border-red-700/50'
                  : 'bg-slate-800 text-slate-100 border border-slate-700/50'
              }`}
            >
              {item.label}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <motion.aside
      variants={sidebarVariants}
      initial={isExpanded ? 'expanded' : 'collapsed'}
      animate={isExpanded ? 'expanded' : 'collapsed'}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={`fixed left-0 top-14 sm:top-16 bottom-0 z-[9999] hidden md:flex flex-col border-r-2 shadow-2xl ${
        isChristmas
          ? 'bg-slate-900 border-red-500'
          : 'bg-slate-900 border-emerald-500'
      }`}
    >
      {/* Toggle Button */}
      <div className="p-3">
        <motion.button
          onClick={toggleSidebar}
          className={`w-full flex items-center justify-center p-2 rounded-lg transition-colors ${
            isChristmas
              ? 'hover:bg-red-500/20 text-red-400'
              : 'hover:bg-emerald-500/20 text-emerald-400'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Always show ChevronRight, rotate 180deg when expanded to point left */}
            <ChevronRight className="w-5 h-5" />
          </motion.div>
        </motion.button>
      </div>

      {/* Tools Section */}
      <div className="flex-1 overflow-y-auto px-2">
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider ${
                isChristmas ? 'text-red-500/70' : 'text-slate-500'
              }`}
            >
              {toolsSection.label}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="space-y-1">
          {toolsSection.items.map((item, index) => renderSidebarItem(item, index))}
        </div>

        {/* Divider */}
        <div
          className={`my-4 mx-2 border-t ${
            isChristmas ? 'border-red-900/30' : 'border-slate-700/50'
          }`}
        />

        {/* Pages Section */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider ${
                isChristmas ? 'text-green-500/70' : 'text-slate-500'
              }`}
            >
              {pagesSection.label}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="space-y-1">
          {pagesSection.items.map((item, index) =>
            renderSidebarItem(item, index + toolsSection.items.length)
          )}
        </div>
      </div>
    </motion.aside>
  );
};
