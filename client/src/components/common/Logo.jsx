const SPOKES = Array.from({ length: 8 }, (_, i) => i * 45);

export default function Logo({ className = 'size-9' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" className={className} aria-hidden="true" focusable="false">
      <circle cx="20" cy="20" r="19" fill="#FF9933" stroke="#171310" strokeWidth="1.6" />
      <circle cx="20" cy="20" r="13" fill="#FFFDF7" stroke="#171310" strokeWidth="1.2" />
      <g stroke="#16317D" strokeWidth="1.6" strokeLinecap="round">
        {SPOKES.map((angle) => (
          <line key={angle} x1="20" y1="20" x2="20" y2="10.5" transform={`rotate(${angle} 20 20)`} />
        ))}
      </g>
      <circle cx="20" cy="20" r="2.6" fill="#16317D" />
    </svg>
  );
}
