/**
 * Four floating corner brackets, like a targeting reticle locked onto a
 * panel. Requires a `relative` positioned parent with some room to spare
 * (the brackets sit just outside the panel's edge).
 */
export default function HudCorners({ color = 'text-teal' }) {
  const base = `pointer-events-none absolute size-5 border-current ${color}`;
  return (
    <>
      <span aria-hidden="true" className={`${base} -left-2 -top-2 border-l-2 border-t-2`} />
      <span aria-hidden="true" className={`${base} -right-2 -top-2 border-r-2 border-t-2`} />
      <span aria-hidden="true" className={`${base} -bottom-2 -left-2 border-b-2 border-l-2`} />
      <span aria-hidden="true" className={`${base} -bottom-2 -right-2 border-b-2 border-r-2`} />
    </>
  );
}
