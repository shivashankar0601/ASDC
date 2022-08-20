import i18next from 'i18next';
import authRoles from '../auth/authRoles';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';

i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('tr', 'navigation', tr);
i18next.addResourceBundle('ar', 'navigation', ar);

const navigationConfig = [
	{
		id: 'applications',
		title: 'Applications',
		translate: 'APPLICATIONS',
		type: 'group',
		icon: 'apps',
		children: [
			{
				id: 'users',
				title: 'Users',
				translate: 'Users',
				type: 'item',
				icon: 'people',
				url: '/users',
				auth: authRoles.admin
			},
			{
				id: 'property',
				title: 'Properties',
				translate: 'Properties',
				type: 'item',
				icon: 'apartment',
				url: '/property',
				auth: ['admin', 'staff']
			}
		]
	}
];

export default navigationConfig;
