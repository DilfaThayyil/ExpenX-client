import { motion } from 'framer-motion';


export const TypingIndicator = () => (
    <div className="flex space-x-1 items-center">
      <span className="text-gray-500 text-sm">typing</span>
      <div className="flex space-x-1">
        {[0, 1, 2].map(dot => (
          <motion.div
            key={dot}
            initial={{ y: 0 }}
            animate={{ y: [0, -3, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatType: "loop",
              delay: dot * 0.2
            }}
            className="h-1.5 w-1.5 bg-gray-500 rounded-full"
          />
        ))}
      </div>
    </div>
  );
  