const NETWORK_MESSAGE = "Can't reach the server. Please try again.";
const RATE_LIMIT_MESSAGE = 'Too many attempts. Please wait a few minutes and try again.';

export function getErrorMessage(error) {
  const response = error?.response;
  if (!response) return NETWORK_MESSAGE;

  const data = response.data && typeof response.data === 'object' ? response.data : {};

  switch (data.code) {
    case 'DUPLICATE_EMAIL':
      return 'An account with this email already exists.';
    case 'INVALID_CREDENTIALS':
      return 'Invalid email or password.';
    case 'RATE_LIMIT_EXCEEDED':
      return RATE_LIMIT_MESSAGE;
    case 'VALIDATION_ERROR': {
      const first = Array.isArray(data.details) ? data.details[0]?.message : undefined;
      return first || 'Please check the details you entered.';
    }
    default:
      break;
  }

  if (response.status === 429) return RATE_LIMIT_MESSAGE;
  if (response.status >= 500) return 'Something went wrong on our side. Please try again shortly.';
  return 'Something went wrong. Please try again.';
}
