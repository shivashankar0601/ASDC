import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import FuseUtils from '@fuse/utils';
import { API } from 'app/shared-components/API';
import { toast } from 'react-toastify';

export const getEvent = createAsyncThunk('EventCommerceApp/event/getProduct', async params => {
	const response = await axios.get(`${API}/properties/${params}`);
	const data = await response.data;
	return data || null;
});

export const removeEvent = createAsyncThunk(
	'EventCommerceApp/event/removeProduct',
	async (val, { dispatch, getState }) => {
		const { id } = getState().EventCommerceApp.product;
		await axios.delete(`${API}/properties/admin/${id}`).catch(() => {
			toast.error(`Error Deleting Property ${id}`);
		});

		return id;
	}
);

export const saveEvent = createAsyncThunk('EventCommerceApp/event/saveProduct', async productData => {
	delete productData.id;
	const newData = {
		...productData,
		price: parseInt(productData.price, 10),
		bedrooms: parseInt(productData.bedrooms, 10),
		bathrooms: parseInt(productData.bathrooms, 10),
		latitude: Number(productData.latitude),
		longitude: Number(productData.longitude),
		size: Number(productData.size)
	};
	axios
		.post(`${API}/properties`, newData)
		.then(response => {
			toast.success('Property Created');
			return response.data;
		})
		.catch(error => {
			console.log(error.message);
			toast.error(error.isAxiosError ? error.response.data.message : error.message);
			return productData;
		});
});

export const updateEvent = createAsyncThunk('EventCommerceApp/event/updateProduct', async ({ productData }) => {
	const newData = {
		...productData,
		price: parseInt(productData.price, 10),
		bedrooms: parseInt(productData.bedrooms, 10),
		bathrooms: parseInt(productData.bathrooms, 10),
		latitude: Number(productData.latitude),
		longitude: Number(productData.longitude),
		size: Number(productData.size)
	};
	axios
		.patch(`${API}/properties/${productData.id}`, newData)
		.then(response => {
			toast.success('Property Updated');
			const { data } = response;
			return data;
		})
		.catch(error => {
			console.log(error.message);
			toast.error(error.isAxiosError ? error.response.data.message : error.message);
		});
});

const EventSlice = createSlice({
	name: 'EventCommerceApp',
	initialState: null,
	reducers: {
		resetProduct: () => null,
		newProduct: {
			reducer: (state, action) => action.payload,
			prepare: event => ({
				payload: {
					id: FuseUtils.generateGUID(),
					title: '',
					description: '',
					price: null,
					bedrooms: null,
					bathrooms: null,
					address: '',
					latitude: null,
					longitude: null,
					size: null,
					url: '',
					featuredImage: '',
					featuredImageId: '',
					user: '',
					images: []
				}
			})
		}
	},
	extraReducers: {
		[getEvent.fulfilled]: (state, action) => action.payload,
		[saveEvent.fulfilled]: (state, action) => action.payload,
		[removeEvent.fulfilled]: (state, action) => null
	}
});

export const { newProduct, resetProduct } = EventSlice.actions;

export default EventSlice.reducer;
