// import React, { ReactNode } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useLocation } from 'react-router-dom';

// interface PageTransitionProps {
//   children: ReactNode;
// }

// const pageVariants = {
//   initial: {
//     opacity: 0,
//     x: '-100vw',
//   },
//   animate: {
//     opacity: 1,
//     x: 0,
//     transition: {
//       type: 'spring',
//       stiffness: 50,
//     },
//   },
//   exit: {
//     opacity: 0,
//     x: '100vw',
//     transition: {
//       ease: 'easeInOut',
//     },
//   },
// };

// const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
//   const location = useLocation();

//   return (
//     <AnimatePresence exitBeforeEnter>
//       <motion.div
//         key={location.pathname}
//         variants={pageVariants}
//         initial="initial"
//         animate="animate"
//         exit="exit"
//         style={{ width: '100%' }}
//       >
//         {children}
//       </motion.div>
//     </AnimatePresence>
//   );
// };

// export default PageTransition;