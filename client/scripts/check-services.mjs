import assert from 'node:assert/strict';

const { getErrorMessage } = await import('../src/services/errorMessages.js');

const errorCases = [
  [{}, "Can't reach the server. Please try again."],
  [undefined, "Can't reach the server. Please try again."],
  [{ response: { status: 409, data: { code: 'DUPLICATE_EMAIL' } } }, 'An account with this email already exists.'],
  [{ response: { status: 401, data: { code: 'INVALID_CREDENTIALS' } } }, 'Invalid email or password.'],
  [
    {
      response: {
        status: 400,
        data: {
          code: 'VALIDATION_ERROR',
          details: [{ field: 'password', message: 'Password must be at least 6 characters' }],
        },
      },
    },
    'Password must be at least 6 characters',
  ],
  [{ response: { status: 400, data: { code: 'VALIDATION_ERROR' } } }, 'Please check the details you entered.'],
  [
    { response: { status: 429, data: { code: 'RATE_LIMIT_EXCEEDED' } } },
    'Too many attempts. Please wait a few minutes and try again.',
  ],
  [
    { response: { status: 502, data: '<html>Bad Gateway</html>' } },
    'Something went wrong on our side. Please try again shortly.',
  ],
  [{ response: { status: 404, data: null } }, 'Something went wrong. Please try again.'],
];

for (const [input, expected] of errorCases) {
  assert.equal(getErrorMessage(input), expected);
}

function stubStorage(value) {
  Object.defineProperty(globalThis, 'localStorage', { value, configurable: true, writable: true });
}

// Scenario A: storage exists but every call throws (private mode / blocked site data)
const throwing = {
  getItem() {
    throw new Error('denied');
  },
  setItem() {
    throw new Error('denied');
  },
  removeItem() {
    throw new Error('denied');
  },
};
stubStorage(throwing);
let store = await import('../src/services/tokenStorage.js?blocked');
assert.equal(store.getToken(), null);
store.setToken('abc');
assert.equal(store.getToken(), 'abc', 'token must survive in memory when storage throws');
store.clearToken();
assert.equal(store.getToken(), null);

// Scenario B: storage missing entirely
stubStorage(undefined);
store = await import('../src/services/tokenStorage.js?missing');
assert.equal(store.getToken(), null);
store.setToken('xyz');
assert.equal(store.getToken(), 'xyz');

// Scenario C: healthy storage
const data = new Map();
stubStorage({
  getItem: (key) => (data.has(key) ? data.get(key) : null),
  setItem: (key, value) => data.set(key, String(value)),
  removeItem: (key) => data.delete(key),
});
data.set('katha_token', 'saved');
store = await import('../src/services/tokenStorage.js?working');
assert.equal(store.getToken(), 'saved');
store.setToken('next');
assert.equal(data.get('katha_token'), 'next');
store.clearToken();
assert.equal(data.has('katha_token'), false);
assert.equal(store.getToken(), null);

console.log('service checks passed');
