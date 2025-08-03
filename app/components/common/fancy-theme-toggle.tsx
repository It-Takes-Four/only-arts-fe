import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import { useTheme } from "../core/theme-context";
import { motion, AnimatePresence } from "framer-motion";

interface FancyThemeToggleProps {
  showLabel?: boolean;
  compact?: boolean;
  variant?: 'default' | 'minimal' | 'gradient';
}

export function FancyThemeToggle({ 
  showLabel = true, 
  compact = false, 
  variant = 'gradient' 
}: FancyThemeToggleProps) {
  const { toggleTheme, theme } = useTheme();

  if (variant === 'minimal') {
    return (
      <button
        onClick={toggleTheme}
        className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-accent/50 transition-all duration-200 group"
      >
        <div className="relative flex items-center justify-center w-8 h-5 bg-gradient-to-r from-blue-400 via-purple-500 to-violet-600 rounded-full shadow-inner">
          <motion.div
            className="absolute w-4 h-4 bg-white rounded-full shadow-lg flex items-center justify-center"
            animate={{
              x: theme === 'dark' ? 6 : -6,
            }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
          >
            <AnimatePresence mode="wait">
              {theme === 'dark' ? (
                <motion.div
                  key="moon"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <MoonIcon className="w-2.5 h-2.5 text-slate-600" />
                </motion.div>
              ) : (
                <motion.div
                  key="sun"
                  initial={{ scale: 0, rotate: 90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: -90 }}
                  transition={{ duration: 0.2 }}
                >
                  <SunIcon className="w-2.5 h-2.5 text-amber-500" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
        {showLabel && (
          <span className="text-sm font-medium group-hover:text-primary transition-colors">
            Switch to {theme === 'dark' ? 'light' : 'dark'} mode
          </span>
        )}
      </button>
    );
  }

  if (compact) {
    return (
      <button
        onClick={toggleTheme}
        className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-accent/50 transition-colors"
      >
        <div className="relative flex items-center justify-center w-8 h-5 bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 rounded-full shadow-inner">
          <motion.div
            className="absolute w-4 h-4 bg-white rounded-full shadow-md flex items-center justify-center"
            animate={{
              x: theme === 'dark' ? 12 : -12,
            }}
            transition={{ type: "spring", stiffness: 700, damping: 30 }}
          >
            {theme === 'dark' ? (
              <MoonIcon className="w-2.5 h-2.5 text-slate-700" />
            ) : (
              <SunIcon className="w-2.5 h-2.5 text-amber-500" />
            )}
          </motion.div>
        </div>
        {showLabel && <span className="text-sm">Toggle theme</span>}
      </button>
    );
  }

  if (variant === 'gradient') {
    return (
      <button
        onClick={toggleTheme}
        className="flex items-center justify-between w-full p-4 rounded-xl bg-gradient-to-br from-violet-500/20 via-purple-500/20 to-pink-500/20 dark:from-violet-600/30 dark:via-purple-600/30 dark:to-pink-600/30 border border-gradient-to-r from-violet-200 via-purple-200 to-pink-200 dark:from-violet-700 dark:via-purple-700 dark:to-pink-700 hover:shadow-lg hover:shadow-violet-500/25 dark:hover:shadow-violet-400/25 transition-all duration-300 group backdrop-blur-sm relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-pink-500/10 dark:from-violet-400/20 dark:via-purple-400/20 dark:to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="relative flex items-center justify-center w-12 h-7 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 rounded-full shadow-inner group-hover:shadow-lg transition-shadow duration-300">
            <motion.div
                className="absolute w-6 h-6 bg-white rounded-full shadow-xl flex items-center justify-center border border-white/20"
              animate={{
                x: theme === 'dark' ? 18 : -18,
              }}
              transition={{ 
                type: "spring", 
                stiffness: 600, 
                damping: 30,
                mass: 0.8
              }}
            >
              <AnimatePresence mode="wait">
                {theme === 'dark' ? (
                  <motion.div
                    key="moon"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MoonIcon className="w-3.5 h-3.5 text-violet-600" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="sun"
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: -180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SunIcon className="w-3.5 h-3.5 text-amber-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
          {showLabel && (
            <div className="text-left">
              <p className="text-sm font-semibold bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:from-violet-500 group-hover:via-purple-500 group-hover:to-pink-500 transition-all">
                Appearance
              </p>
              <motion.p 
                className="text-xs text-muted-foreground capitalize"
                key={theme}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                {theme} mode
              </motion.p>
            </div>
          )}
        </div>
        <motion.div
          animate={{ rotate: theme === 'dark' ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-2xl relative z-10"
        >
          <span className="bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">✨</span>
        </motion.div>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-between w-full p-4 rounded-xl bg-gradient-to-br from-slate-50/50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/50 border border-slate-200/60 dark:border-slate-700/60 hover:shadow-lg hover:shadow-slate-200/25 dark:hover:shadow-slate-900/25 transition-all duration-300 group backdrop-blur-sm"
    >
      <div className="flex items-center gap-4">
        <div className="relative flex items-center justify-center w-12 h-7 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-inner group-hover:shadow-lg transition-shadow duration-300">
          <motion.div
            className="absolute w-6 h-6 bg-white rounded-full shadow-xl flex items-center justify-center border border-slate-200/20"
            animate={{
              x: theme === 'dark' ? 10 : -10,
            }}
            transition={{ 
              type: "spring", 
              stiffness: 600, 
              damping: 30,
              mass: 0.8
            }}
          >
            <AnimatePresence mode="wait">
              {theme === 'dark' ? (
                <motion.div
                  key="moon"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <MoonIcon className="w-3.5 h-3.5 text-slate-600" />
                </motion.div>
              ) : (
                <motion.div
                  key="sun"
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: -180 }}
                  transition={{ duration: 0.3 }}
                >
                  <SunIcon className="w-3.5 h-3.5 text-amber-500" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
        {showLabel && (
          <div className="text-left">
            <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              Appearance
            </p>
            <motion.p 
              className="text-xs text-muted-foreground capitalize"
              key={theme}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              {theme} mode
            </motion.p>
          </div>
        )}
      </div>
      <motion.div
        animate={{ rotate: theme === 'dark' ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className="text-muted-foreground group-hover:text-primary transition-colors"
      >
        ✨
      </motion.div>
    </button>
  );
}
