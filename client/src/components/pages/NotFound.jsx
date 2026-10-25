import { Link } from 'react-router-dom';
import Button from '../common/Button';

export default function NotFound() {
  return (
    <>
      <title>Page not found · KATHA</title>
      <section className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:py-32">
      <p className="font-display text-8xl font-semibold text-vermillion/90 sm:text-9xl" aria-hidden="true">
        404
      </p>
      <h1 className="mt-4 font-display text-3xl font-semibold">This page has wandered off</h1>
      <p className="mt-3 max-w-md text-ink-soft">
        The story you were looking for isn&rsquo;t here &mdash; it may have moved, or it may never have been written.
      </p>
      <Button as={Link} to="/" size="large" className="mt-8">
        Back to home
      </Button>
      </section>
    </>
  );
}
