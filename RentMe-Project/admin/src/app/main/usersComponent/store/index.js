import { combineReducers } from '@reduxjs/toolkit';
import products from './usersSlice';
import product from './userSlice';

const reducer = combineReducers({
	products,
	product
});

export default reducer;
