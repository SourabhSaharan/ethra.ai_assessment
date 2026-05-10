import { motion } from "framer-motion";

function Toast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <motion.div
      key={toast.id}
      initial={{
        opacity: 0,
        y: -20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className={`fixed top-6 right-6 z-[60] min-w-[280px] max-w-sm rounded-2xl border px-4 py-3 shadow-2xl ${
        toast.type === "error"
          ? "border-red-500/40 bg-red-950 text-red-100"
          : "border-cyan-500/40 bg-slate-900 text-cyan-100"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-semibold">
          {toast.message}
        </p>

        <button
          onClick={onClose}
          className="text-xs uppercase tracking-wide text-slate-400 hover:text-white transition-colors"
        >
          Close
        </button>
      </div>
    </motion.div>
  );
}

export default Toast;
