import { ReactNode, ButtonHTMLAttributes } from "react";
import LoadingSpinner from "./LoadingSpinner";

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
}

const SubmitButton = ({
  children,
  loading = false,
  ...props
}: SubmitButtonProps) => {
  return (
    <button
      type="submit"
      disabled={loading || props.disabled}
      className={`
        w-full py-2 px-4 rounded-xl 
        bg-gradient-to-r from-green-400 to-green-600 
        text-white font-bold text-lg shadow-md
        transition-all duration-150
        hover:from-green-500 hover:to-green-700 hover:scale-105
        disabled:opacity-50 disabled:grayscale
        focus:outline-none focus:ring-2 focus:ring-green-300
      `}
      {...props}
    >
      {loading ? <LoadingSpinner /> : children}
    </button>
  );
};

export default SubmitButton;
