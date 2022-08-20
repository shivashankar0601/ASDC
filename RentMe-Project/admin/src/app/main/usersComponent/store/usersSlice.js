import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { API } from 'app/shared-components/API';
import axios from 'axios';
import { toast } from 'react-toastify';

export const getUsers = createAsyncThunk('users', async ({ setTotalCat, page, rowsPerPage, searchText, type }) => {
	const response = await axios.get(
		`${API}/users?page=${page + 1}&per_page=${rowsPerPage}&type=${type !== 'ALL' ? type : ''}&search=${
			searchText || ''
		}`
	);
	const data = await response.data;
	setTotalCat(data.total);
	return data.data;
});

export const removeUser = createAsyncThunk(
	'UsersCommerceApp/users/removeProducts',
	async (productIds, { dispatch, getState }) => {
		productIds.forEach(id => {
			axios.delete(`${API}/users/${id}`).catch(() => {
				toast.error(`Error Deleting User ${id}`);
			});
		});
		return productIds;
	}
);

const usersAdapter = createEntityAdapter({});

export const { selectAll: selectProducts, selectById: selectProductById } = usersAdapter.getSelectors(
	state => state.UsersCommerceApp.products
);

const UsersSlice = createSlice({
	name: 'UsersCommerceApp/users',
	initialState: usersAdapter.getInitialState({
		searchText: ''
	}),
	reducers: {
		setProductsSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' })
		}
	},
	extraReducers: {
		[getUsers.fulfilled]: usersAdapter.setAll,
		[removeUser.fulfilled]: (state, action) => usersAdapter.removeMany(state, action.payload)
	}
});

export const { setProductsSearchText } = UsersSlice.actions;

export default UsersSlice.reducer;
