export default function Card({ as: Component = 'div', className = '', children, ...props }) {
  return (
    <Component className={`glass rounded-2xl ${className}`} {...props}>
      {children}
    </Component>
  );
}
