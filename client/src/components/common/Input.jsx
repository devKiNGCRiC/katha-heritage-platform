import { forwardRef, useId } from 'react';

const Input = forwardRef(function Input({ label, error, hint, id, className = '', ...props }, ref) {
  const autoId = useId();
  const inputId = id || autoId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  return (
    <div className={className}>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-bold text-ink">
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        className={`block w-full rounded-md border-[3px] bg-paper-white px-4 py-2.5 text-base text-ink transition placeholder:text-ink/40 focus:outline-none focus:ring-3 focus:ring-marigold/60 ${
          error ? 'border-crimson' : 'border-ink'
        }`}
        {...props}
      />
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-sm text-ink/70">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-sm font-bold text-crimson-deep">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
