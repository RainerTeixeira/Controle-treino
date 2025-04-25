import { ReactNode, ButtonHTMLAttributes } from "react";

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
      className="w-full py-2 px-4 bg-gradient-to-r from-green-500 to-indigo-500 text-white font-medium rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
      {...props}
    >
      {loading && (
        <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
      )}
      {children}
    </button>
  );
};

export default SubmitButton;
