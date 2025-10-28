import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
  animated?: boolean;
}

export const Logo = ({ className = "", animated = true }: LogoProps) => {
  return (
    <motion.svg
      viewBox="0 0 200 60"
      className={`${className}`}
      whileHover={animated ? { scale: 1.05 } : {}}
      transition={{ duration: 0.2 }}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#5CF0D1", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#8B5CF6", stopOpacity: 1 }} />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Lightning bolt shaped "B" */}
      <motion.path
        d="M 25 10 L 35 10 L 35 20 L 45 20 L 30 35 L 35 35 L 35 45 L 25 45 L 25 35 L 15 35 L 30 20 L 25 20 Z"
        fill="url(#logoGradient)"
        filter="url(#glow)"
        initial={animated ? { pathLength: 0, opacity: 0 } : {}}
        animate={animated ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 1, ease: "easeInOut" }}
      />

      {/* Chain links */}
      <motion.circle
        cx="55"
        cy="20"
        r="8"
        fill="none"
        stroke="url(#logoGradient)"
        strokeWidth="2.5"
        filter="url(#glow)"
        initial={animated ? { scale: 0, opacity: 0 } : {}}
        animate={animated ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: 0.3, duration: 0.5 }}
      />
      
      <motion.circle
        cx="70"
        cy="30"
        r="8"
        fill="none"
        stroke="url(#logoGradient)"
        strokeWidth="2.5"
        filter="url(#glow)"
        initial={animated ? { scale: 0, opacity: 0 } : {}}
        animate={animated ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: 0.4, duration: 0.5 }}
      />
      
      <motion.circle
        cx="55"
        cy="40"
        r="8"
        fill="none"
        stroke="url(#logoGradient)"
        strokeWidth="2.5"
        filter="url(#glow)"
        initial={animated ? { scale: 0, opacity: 0 } : {}}
        animate={animated ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: 0.5, duration: 0.5 }}
      />

      {/* Blink text */}
      <motion.text
        x="90"
        y="38"
        fontFamily="Inter, sans-serif"
        fontSize="24"
        fontWeight="700"
        fill="url(#logoGradient)"
        filter="url(#glow)"
        initial={animated ? { opacity: 0, x: -20 } : {}}
        animate={animated ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        BLINK
      </motion.text>
      
      {/* Spark animation */}
      {animated && (
        <motion.circle
          cx="30"
          cy="30"
          r="2"
          fill="#5CF0D1"
          initial={{ scale: 0, opacity: 1 }}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [1, 0.5, 0],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatDelay: 2,
          }}
        />
      )}
    </motion.svg>
  );
};
