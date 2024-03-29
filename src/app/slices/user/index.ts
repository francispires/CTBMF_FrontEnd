import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {fetchAllUsers} from './api.ts';
import {fetchCount} from "../../../features/counter/counterAPI.ts";

const initialState = createInitialState();

function createInitialState() {
    return {
        users: [] as AuthUser[],
        isLoading: false,
        paging: {
            currentPage: 1,
            pageSize: 2,
            rowCount: 10,
            pageCount: 3,
        } as Pagination,
        error: {},
    }
}


// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const fetchAllUsersAsync = createAsyncThunk(
    'auth/fetchAllUsers',
    async (request: PagedRequest) => {
        return fetchAllUsers(request);
    }
);
export const incrementAsync = createAsyncThunk(
    'counter/fetchCount',
    async (amount: number) => {
        const response = await fetchCount(amount);
        // The value we return becomes the `fulfilled` action payload
        return response.data;
    }
);

export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        gotoPage: (state, action: PayloadAction<number>) => {
            state.paging.currentPage = action.payload;
        },
        setPageSize: (state, action: PayloadAction<number>) => {
            state.paging.pageSize = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllUsersAsync.pending, (state) => {
                state.isLoading = true;
                state.error = {};
            })
            .addCase(fetchAllUsersAsync.fulfilled,
                (state, action) => {
                    const response = action.payload as PagedResponse<AuthUser>;
                    state.users = response.queryable;
                    state.paging.currentPage = response.currentPage;
                    state.paging.pageSize = response.pageSize;
                    state.paging.rowCount = response.rowCount;
                    state.paging.pageCount = response.pageCount;
                    state.isLoading = false;
                })
            .addCase(fetchAllUsersAsync.rejected, (state, action) => {
                state.error = action.error;
                state.isLoading = false;
            })
    },
});
export const userActions = {...usersSlice.actions};
export const usersReducer = usersSlice.reducer;
export default usersReducer;
