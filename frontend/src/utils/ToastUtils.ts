// utils/ToastUtils.ts
import { toast, Slide } from "react-toastify";

export const showToast = (message: string, type: "success" | "error" | "info") => {
  const options = {
    position: "top-right" as const,
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    transition: Slide,
    theme: "dark" as const,
  };

  if (type === "success") toast.success(message, options);
  else if (type === "error") toast.error(message, options);
  else toast.info(message, options);
};