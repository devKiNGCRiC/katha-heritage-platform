export default function Card({ as: Component = 'div', className = '', children, ...props }) {
  return (
    <Component className={`clip-hud border border-teal/25 bg-void/70 backdrop-blur-sm ${className}`} {...props}>
      {children}
    </Component>
  );
}
