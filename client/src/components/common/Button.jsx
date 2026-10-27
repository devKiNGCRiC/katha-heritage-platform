import { forwardRef } from 'react';

const BASE =
  'group relative inline-flex items-center justify-center gap-2 clip-hud-sm font-sans font-bold uppercase tracking-wide transition-all duration-200 active:scale-[0.97]';

const SIZES = {
  small: 'px-4 py-1.5 text-xs',
  medium: 'px-6 py-2.5 text-sm',
  large: 'px-8 py-3.5 text-base',
};

const VARIANTS = {
  primary: 'bg-linear-to-r from-ember via-gold to-ember text-void shadow-[0_0_30px_rgb(255_106_43_/_0.5)] hover:shadow-[0_0_44px_rgb(255_193_77_/_0.65)]',
  secondary: 'bg-linear-to-r from-teal-deep to-teal text-void shadow-[0_0_28px_rgb(47_224_214_/_0.45)] hover:shadow-[0_0_40px_rgb(47_224_214_/_0.6)]',
  outline: 'border border-teal/50 bg-void/60 text-mist backdrop-blur-sm hover:border-teal hover:bg-teal/10',
  ghost: 'text-mist hover:bg-white/10',
  light: 'border border-mist/40 bg-void/40 text-mist backdrop-blur-sm hover:border-mist hover:bg-white/10',
  danger: 'bg-ember-deep text-mist shadow-[0_0_26px_rgb(214_64_26_/_0.5)] hover:brightness-110',
};

/** A diagonal shine that sweeps across on hover, like foil catching light. */
function Shine() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -translate-x-[120%] -skew-x-12 bg-linear-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[120%]"
    />
  );
}

function Spinner() {
  return (
    <svg
      className="relative size-5 animate-spin"
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
  const hasShine = variant === 'primary' || variant === 'secondary';

  const classes = [
    BASE,
    SIZES[size],
    VARIANTS[variant],
    isDisabled ? 'pointer-events-none opacity-60' : 'cursor-pointer overflow-hidden',
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
      {hasShine && !isDisabled && <Shine />}
      {loading && <Spinner />}
      <span className="relative">{children}</span>
    </Component>
  );
});

export default Button;
