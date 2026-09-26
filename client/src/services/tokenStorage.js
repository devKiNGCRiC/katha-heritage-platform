const STORAGE_KEY = 'katha_token';

let token = null;
let loaded = false;

function loadOnce() {
  if (loaded) return;
  loaded = true;
  try {
    token = globalThis.localStorage.getItem(STORAGE_KEY) || null;
  } catch {
    token = null;
  }
}

export function getToken() {
  loadOnce();
  return token;
}

export function setToken(value) {
  loaded = true;
  token = value;
  try {
    globalThis.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Storage is blocked or unavailable: the session lasts until the tab closes.
  }
}

export function clearToken() {
  loaded = true;
  token = null;
  try {
    globalThis.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing persisted, nothing to remove.
  }
}
