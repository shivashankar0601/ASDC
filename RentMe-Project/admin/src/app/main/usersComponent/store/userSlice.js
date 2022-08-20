import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import FuseUtils from '@fuse/utils';
import { API } from 'app/shared-components/API';
import { toast } from 'react-toastify';
import AppContext from 'app/AppContext';
import { useContext } from 'react';

export const getUser = createAsyncThunk('UsersCommerceApp/user/getProduct', async params => {
	const response = await axios.get(`${API}/users/${params}`);
	const data = await response.data;

	if (!data) {
		return null;
	}
	const newdata = {
		id: data.id,
		email: data.email,
		password: '',
		fullname: data.fullname,
		role: data.role.name || ''
	};
	return newdata;
});

export const removeUser = createAsyncThunk(
	'UsersCommerceApp/user/removeProduct',
	async (val, { dispatch, getState }) => {
		const { id } = getState().UsersCommerceApp.product;
		await axios.patch(`${API}/admin/disable/${id}`).catch(() => {
			toast.error(`Error Disabling User ${id}`);
		});

		return id;
	}
);

export const saveUser = createAsyncThunk('UsersCommerceApp/user/saveProduct', async productData => {
	const data = {
		email: productData.email,
		fullname: productData.fullname,
		password: productData.password,
		role: productData.role
	};

	let baseUrl = `${API}/auth/register`;
	if (data.role === 'admin') {
		baseUrl += '/admin';
	}
	if (data.role === 'landlord') {
		baseUrl += '/landlord';
	}

	axios
		.post(baseUrl, data)
		.then(response => {
			toast.success('User Created');
			return response.data;
		})
		.catch(error => {
			console.log(error.message);
			toast.error(error.isAxiosError ? error.response.data.message : error.message);
		});
});

export const updateUser = createAsyncThunk('UsersCommerceApp/user/update', async productData => {
	console.log(productData);
	axios
		.patch(`${API}/users/admin/${productData.id}`, productData)
		.then(response => {
			toast.success('User Updated');
			const { data } = response;

			if (data) {
				return null;
			}
			const newdata = {
				id: data.id,
				email: data.email,
				password: '',
				fullname: data.fullname,
				role: data.role.name || ''
			};
			return newdata;
		})
		.catch(error => {
			console.log(error.message);
			toast.error(error.isAxiosError ? error.response.data.message : error.message);
		});
});

const UserSlice = createSlice({
	name: 'UsersCommerceApp/product',
	initialState: null,
	reducers: {
		resetProduct: () => null,
		newProduct: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					id: FuseUtils.generateGUID(),
					email: '',
					password: '',
					fullname: '',
					role: 'user'
				}
			})
		}
	},
	extraReducers: {
		[getUser.fulfilled]: (state, action) => action.payload,
		[saveUser.fulfilled]: (state, action) => action.payload
	}
});

export const { newProduct, resetProduct } = UserSlice.actions;

export default UserSlice.reducer;
