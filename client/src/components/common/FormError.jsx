import { AlertIcon } from './Icons';

export default function FormError({ message }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="flex items-start gap-2.5 rounded-md border border-terracotta/40 bg-terracotta/10 p-3.5 text-sm font-medium text-ink"
    >
      <AlertIcon className="mt-0.5 size-5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
