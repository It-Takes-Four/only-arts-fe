import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from './button';

export function FloatingActionButton() {
  return (
    <motion.div
      className="fixed bottom-8 right-8 z-50"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 1
      }}
    >
      <motion.div
        whileHover={{ 
          scale: 1.1,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <Button
          size="lg"
          className="h-14 w-14 rounded-full shadow-xl bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 border-0"
          onClick={() => {
            // TODO: Navigate to create post page
            //console.log('Create new post');
          }}
        >
          <motion.div
            animate={{ rotate: [0, 180, 360] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatType: "loop",
              ease: "linear"
            }}
          >
            <Plus className="h-6 w-6" />
          </motion.div>
        </Button>
        
        {/* Floating particles effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            background: [
              "conic-gradient(from 0deg, transparent, rgba(59, 130, 246, 0.3), transparent)",
              "conic-gradient(from 180deg, transparent, rgba(147, 51, 234, 0.3), transparent)",
              "conic-gradient(from 360deg, transparent, rgba(59, 130, 246, 0.3), transparent)"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{ zIndex: -1 }}
        />
      </motion.div>
    </motion.div>
  );
}
