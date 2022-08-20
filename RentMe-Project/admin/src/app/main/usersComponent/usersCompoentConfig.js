import { lazy } from 'react';
import authRoles from '../../auth/authRoles';

const usersComponentConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/users',
			exact: true,
			component: lazy(() => import('./users/User'))
		},
		{
			path: '/user/:productId',
			exact: true,
			component: lazy(() => import('./user/User'))
		}
	]
};

export default usersComponentConfig;
