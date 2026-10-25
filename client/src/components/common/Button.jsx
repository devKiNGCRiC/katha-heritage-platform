import { forwardRef } from 'react';

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full font-sans font-semibold transition-all duration-200 active:scale-[0.97]';

const SIZES = {
  small: 'px-4 py-1.5 text-sm',
  medium: 'px-6 py-2.5 text-base',
  large: 'px-8 py-3.5 text-lg',
};

const VARIANTS = {
  primary:
    'bg-linear-to-r from-saffron to-gold text-void shadow-[0_0_30px_rgb(255_153_51_/_0.45)] hover:shadow-[0_0_42px_rgb(255_211_110_/_0.6)] hover:brightness-105',
  secondary:
    'bg-linear-to-r from-astra to-astra-deep text-mist shadow-[0_0_30px_rgb(193_78_255_/_0.4)] hover:shadow-[0_0_42px_rgb(193_78_255_/_0.55)]',
  outline: 'glass text-mist hover:bg-white/10',
  ghost: 'text-mist hover:bg-white/10',
  light: 'glass text-mist hover:bg-white/10',
  danger: 'bg-ember text-mist shadow-[0_0_28px_rgb(255_85_102_/_0.4)] hover:bg-ember-deep',
};

function Spinner() {
  return (
    <svg
      className="size-5 animate-spin"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

const Button = forwardRef(function Button(
  {
    as: Component = 'button',
    variant = 'primary',
    size = 'medium',
    loading = false,
    disabled = false,
    type = 'button',
    className = '',
    children,
    ...props
  },
  ref,
) {
  const isDisabled = disabled || loading;
  const isNativeButton = Component === 'button';

  const classes = [
    BASE,
    SIZES[size],
    VARIANTS[variant],
    isDisabled ? 'pointer-events-none opacity-60' : 'cursor-pointer',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Component
      ref={ref}
      {...(isNativeButton ? { type, disabled: isDisabled } : {})}
      aria-disabled={isDisabled || undefined}
      aria-busy={loading || undefined}
      className={classes}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </Component>
  );
});

export default Button;
