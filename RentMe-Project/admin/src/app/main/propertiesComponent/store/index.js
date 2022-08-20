import { combineReducers } from '@reduxjs/toolkit';
import products from './propertiesSlice';
import product from './propertySlice';

const reducer = combineReducers({
	products,
	product
});

export default reducer;
