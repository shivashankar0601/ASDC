import FuseUtils from '@fuse/utils';
import propertiesComponentConfig from 'app/main/propertiesComponent/propertiesCompoentConfig';
import Login2PageConfig from 'app/main/login/Login2PageConfig';
import usersComponentConfig from 'app/main/usersComponent/usersCompoentConfig';
import { Redirect } from 'react-router-dom';
import RegisterConfig from 'app/main/register/RegisterConfig';

const routeConfigs = [Login2PageConfig, usersComponentConfig, propertiesComponentConfig, RegisterConfig];

const routes = [
	// if you want to make whole app auth protected by default change defaultAuth for example:
	// ...FuseUtils.generateRoutesFromConfigs(routeConfigs, ['admin','staff','user']),
	// The individual route configs which has auth option won't be overridden.
	...FuseUtils.generateRoutesFromConfigs(routeConfigs, ['admin', 'staff']),
	{
		path: '/',
		component: () => <Redirect to="/users" />
	}
];

export default routes;
