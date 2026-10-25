export default function Card({ as: Component = 'div', className = '', children, ...props }) {
  return (
    <Component className={`rounded-md border border-gold-leaf/25 bg-parchment-light shadow-card ${className}`} {...props}>
      {children}
    </Component>
  );
}
