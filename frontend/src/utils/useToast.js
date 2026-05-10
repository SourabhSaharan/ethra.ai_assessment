import { useEffect, useState } from "react";

function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = (
    message,
    type = "success"
  ) => {
    setToast({
      id: Date.now(),
      message,
      type,
    });
  };

  useEffect(() => {
    if (!toast) return;

    const timeout = setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [toast]);

  return {
    toast,
    showToast,
    clearToast: () => setToast(null),
  };
}

export default useToast;
