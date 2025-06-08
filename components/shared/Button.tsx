import React, { useRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success' | 'info' | 'outline' | 'success_outline' | 'danger_outline' | 'info_outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  glowing?: boolean; 
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className = '',
  leftIcon,
  rightIcon,
  glowing = false,
  onClick,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const baseStyles = "font-semibold rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800 transition-all duration-300 ease-in-out flex items-center justify-center group transform active:scale-95 disabled:hover:scale-100 disabled:active:scale-100 overflow-hidden relative"; // Added overflow-hidden and relative
  
  const variantStyles = {
    primary: "bg-primary-500 hover:bg-primary-600 text-white focus-visible:ring-primary hover:shadow-lg hover:-translate-y-0.5",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 focus-visible:ring-gray-500 hover:shadow-md",
    danger: "bg-red-600 hover:bg-red-700 text-white focus-visible:ring-red-500 hover:shadow-lg hover:-translate-y-0.5",
    ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700/70 text-primary-600 dark:text-primary-400 focus-visible:ring-primary",
    success: "bg-green-600 hover:bg-green-700 text-white focus-visible:ring-green-500 hover:shadow-lg hover:-translate-y-0.5",
    info: "bg-sky-500 hover:bg-sky-600 text-white focus-visible:ring-sky-400 hover:shadow-lg hover:-translate-y-0.5",
    outline: "bg-transparent border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 focus-visible:ring-gray-500",
    success_outline: "bg-transparent border border-green-500 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-700/20 focus-visible:ring-green-500",
    danger_outline: "bg-transparent border border-red-500 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-700/20 focus-visible:ring-red-500",
    info_outline: "bg-transparent border border-sky-500 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-700/20 focus-visible:ring-sky-500",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
    xl: "px-8 py-4 text-lg",
  };

  const disabledStyles = "opacity-60 cursor-not-allowed hover:scale-100 hover:shadow-none hover:-translate-y-0";
  const glowAnimation = glowing && !disabled && !isLoading ? "animate-buttonGlowHover" : "";

  const handleRippleEffect = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (buttonRef.current && !disabled && !isLoading) {
      const button = buttonRef.current;
      const rect = button.getBoundingClientRect();
      const ripple = document.createElement('span');
      const diameter = Math.max(button.clientWidth, button.clientHeight);
      const radius = diameter / 2;

      ripple.style.width = ripple.style.height = `${diameter}px`;
      ripple.style.left = `${event.clientX - rect.left - radius}px`;
      ripple.style.top = `${event.clientY - rect.top - radius}px`;
      ripple.classList.add('ripple-effect'); // CSS class for styling and animation

      const existingRipple = button.querySelector('.ripple-effect');
      if (existingRipple) {
        existingRipple.remove();
      }
      
      button.appendChild(ripple);

      // Call original onClick if it exists
      if (onClick) {
        onClick(event);
      }
    }
  };

  return (
    <button
      ref={buttonRef}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabled || isLoading ? disabledStyles : ''} ${glowAnimation} ${className}`}
      disabled={disabled || isLoading}
      onClick={handleRippleEffect} // Use the ripple handler
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center w-full h-full"> {/* Content wrapper for z-index */}
        {isLoading && (
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
          style={{ marginLeft: leftIcon ? '-0.25rem' : '0', marginRight: children || rightIcon ? '0.75rem' : '0' }}
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {leftIcon && !isLoading && <span className={`mr-2 h-5 w-5 flex items-center justify-center ${size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} group-hover:animate-pulse`}>{leftIcon}</span>}
        <span className="truncate">{children}</span>
        {rightIcon && !isLoading && <span className={`ml-2 h-5 w-5 flex items-center justify-center ${size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} group-hover:animate-pulse`}>{rightIcon}</span>}
      </span>
    </button>
  );
};

export default Button;