import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as authService from '../services/authService';
import { getErrorMessage } from '../services/errorMessages';
import { clearToken, getToken, setToken } from '../services/tokenStorage';

const FALLBACK_ERROR = 'Something went wrong. Please try again.';

// Runs synchronously at dispatch time, so a rapid double-click can never start two requests.
const notAlreadyLoading = (_, { getState }) => getState().auth.status !== 'loading';

export const registerUser = createAsyncThunk(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await authService.register(payload);
      setToken(data.token);
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
  { condition: notAlreadyLoading },
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await authService.login(payload);
      setToken(data.token);
      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
  { condition: notAlreadyLoading },
);

export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async (_, { rejectWithValue }) => {
  try {
    return await authService.fetchMe();
  } catch (error) {
    const unauthorized = error?.response?.status === 401;
    if (unauthorized) clearToken();
    return rejectWithValue({ message: getErrorMessage(error), unauthorized });
  }
});

const initialToken = getToken();

const initialState = {
  user: null,
  token: initialToken,
  status: 'idle',
  error: null,
  initializing: Boolean(initialToken),
};

const startLoading = (state) => {
  state.status = 'loading';
  state.error = null;
};

const authenticated = (state, action) => {
  state.status = 'succeeded';
  state.user = action.payload.user;
  state.token = action.payload.token;
  state.initializing = false;
};

const authFailed = (state, action) => {
  state.status = 'failed';
  state.error = typeof action.payload === 'string' ? action.payload : FALLBACK_ERROR;
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
      if (state.status === 'failed') state.status = 'idle';
    },
    sessionCleared(state) {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
      state.initializing = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, startLoading)
      .addCase(registerUser.fulfilled, authenticated)
      .addCase(registerUser.rejected, authFailed)
      .addCase(loginUser.pending, startLoading)
      .addCase(loginUser.fulfilled, authenticated)
      .addCase(loginUser.rejected, authFailed)
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.initializing = false;
        if (!state.token) return;
        state.user = action.payload.user;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.initializing = false;
        if (action.payload?.unauthorized) {
          state.token = null;
          state.user = null;
        }
      });
  },
});

export const { clearError, sessionCleared } = authSlice.actions;

export const logout = () => (dispatch) => {
  clearToken();
  dispatch(sessionCleared());
};

export default authSlice.reducer;
