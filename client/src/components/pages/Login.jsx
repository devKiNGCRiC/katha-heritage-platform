import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import Button from '../common/Button';
import FormError from '../common/FormError';
import Input from '../common/Input';
import AuthPanel from '../layout/AuthPanel';
import { clearError, loginUser } from '../../store/authSlice';

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;
const LINK = 'font-semibold text-navy underline underline-offset-4 hover:text-saffron-deep';

export default function Login() {
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: '', password: '' } });

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  if (user) return <Navigate to="/" replace />;

  const onSubmit = (values) => dispatch(loginUser({ email: values.email, password: values.password }));

  return (
    <AuthPanel
      title="Welcome back"
      subtitle="Sign in to continue your journey through India's stories."
      footer={
        <>
          New to KATHA?{' '}
          <Link to="/register" className={LINK}>
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <FormError message={error} />
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          inputMode="email"
          error={errors.email?.message}
          {...register('email', {
            setValueAs: (value) => value.trim(),
            required: 'Enter your email address',
            pattern: { value: EMAIL_PATTERN, message: 'Enter a valid email address' },
          })}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password', { required: 'Enter your password' })}
        />
        <Button type="submit" size="large" loading={status === 'loading'} className="w-full">
          Sign in
        </Button>
      </form>
    </AuthPanel>
  );
}
