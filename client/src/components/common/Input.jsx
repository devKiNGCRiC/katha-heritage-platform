import { forwardRef, useId } from 'react';

const Input = forwardRef(function Input({ label, error, hint, id, className = '', ...props }, ref) {
  const autoId = useId();
  const inputId = id || autoId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  return (
    <div className={className}>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-navy">
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        className={`block w-full rounded-lg border bg-white px-4 py-3 text-base text-charcoal shadow-sm transition placeholder:text-charcoal-soft/70 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/30 ${
          error ? 'border-red-600' : 'border-charcoal/25'
        }`}
        {...props}
      />
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-sm text-charcoal-soft">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
