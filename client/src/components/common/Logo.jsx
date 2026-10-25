export default function Logo({ className = 'size-9' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" className={className} aria-hidden="true" focusable="false">
      <rect width="40" height="40" rx="8" fill="#B23A2E" />
      <circle cx="20" cy="5.2" r="1.2" fill="#B8923F" />
      <path d="M20 6l3.5 6h-7zM20 10.5l6 8.5H14zM20 15.5L29 27H11z" fill="#F3EAD2" />
      <rect x="9" y="27" width="22" height="5" rx="1" fill="#232A4D" />
      <path d="M17.5 32v-2.5a2.5 2.5 0 015 0V32z" fill="#B8923F" />
    </svg>
  );
}
