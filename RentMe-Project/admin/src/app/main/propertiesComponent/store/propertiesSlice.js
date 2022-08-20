import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { API } from 'app/shared-components/API';
import axios from 'axios';
import { toast } from 'react-toastify';

export const getEvents = createAsyncThunk('events', async ({ setTotalCat, page, rowsPerPage }) => {
	const response = await axios.get(`${API}/properties?page=${page + 1}&per_page=${rowsPerPage}`);
	const data = await response.data;
	setTotalCat(data.total);
	return data.data;
});

export const removeEvent = createAsyncThunk(
	'EventsCommerceApp/events/removeProducts',
	async (productIds, { dispatch, getState }) => {
		productIds.forEach(id => {
			axios.delete(`${API}/users/${id}`).catch(() => {
				toast.error(`Error Deleting User ${id}`);
			});
		});
		return productIds;
	}
);

const eventsAdapter = createEntityAdapter({});

export const { selectAll: selectProducts, selectById: selectProductById } = eventsAdapter.getSelectors(
	state => state.EventsCommerceApp.products
);

const EventsSlice = createSlice({
	name: 'EventsCommerceApp',
	initialState: eventsAdapter.getInitialState({
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
		[getEvents.fulfilled]: eventsAdapter.setAll,
		[removeEvent.fulfilled]: (state, action) => eventsAdapter.removeMany(state, action.payload)
	}
});

export const { setProductsSearchText } = EventsSlice.actions;

export default EventsSlice.reducer;
