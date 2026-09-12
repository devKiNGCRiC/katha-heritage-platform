// 🎯 Purpose: Reusable Button component for KATHA Heritage Platform
// 📚 Concept: Custom button with Indian heritage color schemes and accessibility
// 🔧 How it works: Props-based styling with predefined variants using standard Tailwind classes

import { forwardRef } from 'react';

// Button component with Indian heritage styling
const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  type = 'button',
  ...props 
}, ref) => {
  
  // 🎨 Indian Heritage Color Variants (using standard Tailwind classes)
  const variants = {
    // 🧡 Primary - Saffron to Red gradient (main CTA)
    primary: 'bg-gradient-to-r from-orange-500 via-amber-500 to-red-500 hover:from-orange-600 hover:via-amber-600 hover:to-red-600 text-white shadow-orange-200',
    
    // 🔵 Secondary - Blue tones (secondary actions)
    secondary: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-blue-200',
    
    // 🟢 Success - Green tones (positive actions)
    success: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-green-200',
    
    // 🟡 Warning - Gold/Yellow (caution actions)
    warning: 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-yellow-900 shadow-yellow-200',
    
    // 🔴 Danger - Deep red (destructive actions)
    danger: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-red-200',
    
    // ⚪ Outline - Border only (subtle actions)
    outline: 'border-2 border-orange-500 text-orange-600 hover:bg-orange-50 hover:border-orange-600 bg-white shadow-orange-100',
    
    // 👻 Ghost - Minimal (very subtle actions)
    ghost: 'text-orange-600 hover:bg-orange-50 hover:text-orange-700 shadow-none',
    
    // 🇮🇳 Tricolor - Special Indian flag inspired
    tricolor: 'bg-white border-2 border-orange-500 text-orange-700 hover:bg-orange-50 shadow-orange-200 relative overflow-hidden'
  };

  // 📏 Size Variants
  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };

  // 🎯 Base Classes - consistent across all variants
  const baseClasses = [
    // Layout and spacing
    'inline-flex items-center justify-center',
    'font-semibold rounded-xl',
    
    // Transitions and animations
    'transition-all duration-300 ease-in-out',
    'transform hover:scale-105 active:scale-95',
    
    // Shadows and focus
    'shadow-lg hover:shadow-xl',
    'focus:outline-none focus:ring-4 focus:ring-orange-300 focus:ring-offset-2',
    
    // Disabled states
    disabled || loading ? 'opacity-60 cursor-not-allowed transform-none hover:scale-100' : 'cursor-pointer',
    
    // Responsive design
    'select-none',
    
    // Size and variant
    sizes[size],
    variants[variant],
    
    // Custom classes
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={ref}
      type={type}
      className={baseClasses}
      disabled={disabled || loading}
      onClick={disabled || loading ? undefined : onClick}
      aria-disabled={disabled || loading}
      {...props}
    >
      {/* 🔄 Loading Spinner */}
      {loading && (
        <div className="mr-3">
          <svg 
            className="animate-spin h-5 w-5" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            {/* Spinner track */}
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            {/* Spinner path */}
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}
      
      {/* 📝 Button Content */}
      <span className={loading ? 'opacity-75' : ''}>
        {children}
      </span>
      
      {/* 🇮🇳 Special tricolor effect */}
      {variant === 'tricolor' && (
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-white/20 to-green-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
      )}
    </button>
  );
});

// Set display name for React DevTools
Button.displayName = 'Button';

export default Button;
