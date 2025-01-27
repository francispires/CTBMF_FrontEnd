import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {logout} from './api.ts';
import {history} from "../../../_helpers";
import {apiUrl} from "../../../_helpers/utils.ts";
import {get} from "../../../_helpers/api.ts";

const initialState = createInitialState();
function createInitialState() {
    try {
        const user = JSON.parse(localStorage.getItem('user') as string);
        return {
            // initialize state from local storage to enable user to stay logged in
            user: user,
            error: {},
        }
    }catch (e) {
        localStorage.removeItem('user');
        return {
            user: null,
            error: {},
        }
    }
}

export const logoutAsync = createAsyncThunk(
    'auth/logoutAsync',
    async () => {
      const response = await logout();
      return response.data;
    }
);

export const loginAsync = createAsyncThunk(
    'auth/loginAsync',
    (u:AuthUser) => {
        return u;
    }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
        .addCase(logoutAsync.pending, (state) => {
            state.error = {};
        })
        .addCase(logoutAsync.fulfilled, (state) => {
            state.user = null;
            localStorage.removeItem('user');
            history.navigate('/login');
        })
        .addCase(logoutAsync.rejected, (state,action) => {
            state.error = action.error;
        })

        .addCase(loginAsync.pending, (state) => {
            state.error = {};
        })
        .addCase(loginAsync.fulfilled, (state, action) => {
            const user = action.payload;
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(user));
            state.user = user;
            //setTimeout(() => {get(`${apiUrl}/users/me`);}, 1);

            // get return url from location state or default to home page
            // const { from } = history.location.state || { from: { pathname: '/' } };
            // history.navigate(from.pathname);
        })
        .addCase(loginAsync.rejected, (state,action) => {
            state.error = action.error;
        })
    ;
  },
});
export const authActions = { ...authSlice.actions};
export const authReducer = authSlice.reducer;
export default authReducer;