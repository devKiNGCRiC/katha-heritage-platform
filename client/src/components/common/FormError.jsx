import { AlertIcon } from './Icons';

export default function FormError({ message }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="flex items-start gap-2.5 rounded-md border border-ember/40 bg-ember/15 p-3.5 text-sm font-medium text-mist"
    >
      <AlertIcon className="mt-0.5 size-5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
