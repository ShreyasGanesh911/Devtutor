import { ReactNode } from "react";

type ButtonProps = {
  icon?: ReactNode;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
};

export default function Button({ icon, children, onClick, className = "" }: ButtonProps) {
  return (
    <button
      className={`
        rounded-full xl:p-4 p-2 
        flex items-center gap-1 
        border border-gray-600
        bg-gray-700 text-gray-200
        hover:bg-gray-600 
        hover:border-gray-500
        transition-colors duration-200
        hover:cursor-pointer 
        font-semibold
        ${className}
      `}
      onClick={onClick}
    >
      {icon}
      {children}
    </button>
  );
}