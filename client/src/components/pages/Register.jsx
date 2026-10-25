import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import Button from '../common/Button';
import FormError from '../common/FormError';
import Input from '../common/Input';
import AuthPanel from '../layout/AuthPanel';
import { clearError, registerUser } from '../../store/authSlice';

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;
const LINK = 'font-bold text-gold underline underline-offset-4 hover:text-saffron';

export default function Register() {
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { name: '', email: '', password: '', confirmPassword: '' } });

  useEffect(() => {
    dispatch(clearError());
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  if (user) return <Navigate to="/" replace />;

  const onSubmit = (values) =>
    dispatch(registerUser({ name: values.name, email: values.email, password: values.password }));

  return (
    <>
      <title>Create account · KATHA</title>
      <AuthPanel
        title="Create your account"
        subtitle="Join KATHA and start collecting the stories that shaped a civilisation."
        footer={
          <>
            Already have an account?{' '}
            <Link to="/login" className={LINK}>
              Sign in
            </Link>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          <FormError message={error} />
          <Input
            label="Full name"
            type="text"
            autoComplete="name"
            error={errors.name?.message}
            {...register('name', {
              setValueAs: (value) => value.trim(),
              required: 'Enter your name',
              maxLength: { value: 100, message: 'Name must be 100 characters or fewer' },
            })}
          />
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
            autoComplete="new-password"
            hint="At least 6 characters."
            error={errors.password?.message}
            {...register('password', {
              required: 'Choose a password',
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
              deps: ['confirmPassword'],
            })}
          />
          <Input
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Confirm your password',
              validate: (value, formValues) => value === formValues.password || 'Passwords do not match',
            })}
          />
          <Button type="submit" size="large" loading={status === 'loading'} className="w-full">
            Create account
          </Button>
        </form>
      </AuthPanel>
    </>
  );
}
