import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import { fetchWrapper } from '../_helpers';

// create slice
const name = 'users';
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();
const slice = createSlice({ name, initialState, extraReducers });
// exports

export const userActions = { ...slice.actions, ...extraActions };
export const usersReducer = slice.reducer;

// implementation
function createInitialState() {
    return {
        users: {},
        paging: {
            pageNumber: 0,
            pageSize: 10,
            totalCount: 0,
            totalPages: 0,
        },
    }
}

function createExtraActions() {

    const baseUrl = `${import.meta.env.VITE_REACT_APP_API_SERVER_URL}/users`;

    return {
        getAll: getAll()
    };

    function getAll() {
        const url = `${baseUrl}/all?page=1&sort=created_at:1&perpage=1&includeTotals=true`;
        return createAsyncThunk(
            `${name}/all`,
            async () => await fetchWrapper.get(url)
        );
    }
}

function createExtraReducers() {
    return (builder)=>{
        getAll();
        function getAll() {
            const {pending, fulfilled, rejected} = extraActions.getAll;
            builder
                .addCase(pending, (state) => {
                    state.users = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    state.users = action.payload;
                    // store user details and basic auth data in local storage to keep user logged in between page refreshes
                    // localStorage.setItem('user', JSON.stringify(user));
                    // state.user = user;
                    //
                    // // get return url from location state or default to home page
                    // const { from } = history.location.state || { from: { pathname: '/' } };
                    // history.navigate(from);
                })
                .addCase(rejected, (state, action) => {
                    state.users = { error: action.error };
                });
        }
    }
}
