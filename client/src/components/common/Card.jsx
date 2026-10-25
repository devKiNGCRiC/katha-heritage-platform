export default function Card({ as: Component = 'div', className = '', children, ...props }) {
  return (
    <Component className={`rounded-lg border-[3px] border-ink bg-paper-white shadow-card ${className}`} {...props}>
      {children}
    </Component>
  );
}
