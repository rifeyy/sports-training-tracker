import toast from "react-hot-toast";

export const success = (msg: string) => toast.success(msg);
export const error = (msg: string) => toast.error(msg);

export const loading = (msg: string) => {
  return toast.loading(msg);
};

export const dismiss = () => {
  toast.dismiss();
};




