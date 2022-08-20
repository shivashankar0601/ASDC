import { lazy } from 'react';

const propertiesComponentConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/property',
			exact: true,
			component: lazy(() => import('./properties/Property'))
		},
		{
			path: '/property/:productId',
			exact: true,
			component: lazy(() => import('./property/Property'))
		}
	]
};

export default propertiesComponentConfig;
