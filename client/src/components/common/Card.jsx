export default function Card({ as: Component = 'div', className = '', children, ...props }) {
  return (
    <Component className={`rounded-2xl border border-gold/25 bg-white shadow-card ${className}`} {...props}>
      {children}
    </Component>
  );
}
