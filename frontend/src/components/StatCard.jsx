import { motion } from "framer-motion";

function StatCard({
  title,
  value,
  icon,
  color,
}) {
  return (
    <motion.div
      whileHover={{
        scale: 1.03,
      }}
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
      }}
      className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-slate-400 text-sm">
            {title}
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {value}
          </h2>
        </div>

        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${color}`}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

export default StatCard;