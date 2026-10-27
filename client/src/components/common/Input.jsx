import { forwardRef, useId } from 'react';

const Input = forwardRef(function Input({ label, error, hint, id, className = '', ...props }, ref) {
  const autoId = useId();
  const inputId = id || autoId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  return (
    <div className={className}>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-mist">
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        className={`block w-full rounded-md border bg-void/60 px-4 py-3 text-base text-mist shadow-[inset_0_1px_3px_rgb(0_0_0_/_0.5)] backdrop-blur-sm transition placeholder:text-mist/35 focus:outline-none focus:ring-2 focus:ring-teal/60 ${
          error ? 'border-ember' : 'border-teal/25'
        }`}
        {...props}
      />
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-sm text-mist/60">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-sm font-medium text-ember">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
