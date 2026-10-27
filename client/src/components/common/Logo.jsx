const SPOKES = Array.from({ length: 8 }, (_, i) => i * 45);

export default function Logo({ className = 'size-9' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="katha-logo-ring" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0%" stopColor="#FF6A2B" />
          <stop offset="100%" stopColor="#FFC14D" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="19" fill="url(#katha-logo-ring)" stroke="#070F0E" strokeWidth="1.4" />
      <circle cx="20" cy="20" r="13" fill="#070F0E" />
      <g stroke="#2FE0D6" strokeWidth="1.6" strokeLinecap="round">
        {SPOKES.map((angle) => (
          <line key={angle} x1="20" y1="20" x2="20" y2="10.5" transform={`rotate(${angle} 20 20)`} />
        ))}
      </g>
      <circle cx="20" cy="20" r="2.4" fill="#FFC14D" />
    </svg>
  );
}
