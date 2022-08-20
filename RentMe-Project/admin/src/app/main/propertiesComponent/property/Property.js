import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { useDeepCompareEffect } from '@fuse/hooks';
import { yupResolver } from '@hookform/resolvers/yup';
import _ from '@lodash';
import Button from '@material-ui/core/Button';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import withReducer from 'app/store/withReducer';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import * as yup from 'yup';
import reducer from '../store';
import { getEvent, newProduct, resetProduct } from '../store/propertySlice';
import EventHeader from './PropertyHeader';
import PropertyAddress from './tabs/Address';
import BasicInfoTab from './tabs/EventInfoTab';
import TimingInfo from './tabs/PropertyImages';

const schema = yup.object().shape({
	title: yup.string().required().trim().min(3),
	description: yup.string().required().trim().min(3),
	price: yup
		.number()
		.required()
		.test('Is positive?', 'ERROR: The number must be greater than 0!', value => value > 0),
	bedrooms: yup
		.number()
		.required()
		.test('Is positive?', 'ERROR: The number must be greater than 0!', value => value > 0),
	bathrooms: yup
		.number()
		.required()
		.test('Is positive?', 'ERROR: The number must be greater than 0!', value => value > 0),
	address: yup.string().required().trim().min(3),
	latitude: yup
		.number()
		.required()
		.test('Is Latitude 1?', 'ERROR: The number must be less than 90!', value => value <= 90)
		.test('Is Latitude 2?', 'ERROR: The number must be greater than -90!', value => value >= -90),
	longitude: yup
		.number()
		.required()
		.test('Is Longitude 1?', 'ERROR: The number must be less than 180!', value => value <= 180)
		.test('Is Longitude 2?', 'ERROR: The number must be greater than -180!', value => value >= -180),
	size: yup
		.number()
		.required()
		.test('Is positive?', 'ERROR: The number must be greater than 0!', value => value > 0)
});

function Event(props) {
	const dispatch = useDispatch();
	const product = useSelector(({ EventCommerceApp }) => EventCommerceApp.product);

	const routeParams = useParams();

	const [tabValue, setTabValue] = useState(0);
	const [noProduct, setNoProduct] = useState(false);
	const [isOldProduct, setIsOldProduct] = useState(false);
	const methods = useForm({
		mode: 'onChange',
		defaultValues: {},
		resolver: isOldProduct ? null : yupResolver(schema)
	});
	const { reset, watch, setValue } = methods;
	const form = watch();

	useDeepCompareEffect(() => {
		function updateProductState() {
			const { productId } = routeParams;

			if (productId === 'new') {
				/**
				 * Create New Product data
				 */

				dispatch(newProduct());
			} else {
				/**
				 * Get Product data
				 */
				dispatch(getEvent(productId)).then(action => {
					/**
					 * If the requested product is not exist show message
					 */
					if (!action.payload) {
						setNoProduct(true);
					} else {
						setIsOldProduct(true);
					}
				});
			}
		}

		updateProductState();
	}, [dispatch, routeParams]);

	useEffect(() => {
		if (!product) {
			return;
		}
		/**
		 * Reset the form on product state changes
		 */
		reset(product);
	}, [product, reset]);

	useEffect(() => {
		return () => {
			/**
			 * Reset Product on component unload
			 */
			dispatch(resetProduct());
			setNoProduct(false);
		};
	}, [dispatch]);

	/**
	 * Tab Change
	 */
	function handleTabChange(event, value) {
		setTabValue(value);
	}

	/**
	 * Show Message if the requested products is not exists
	 */
	if (noProduct) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography color="textSecondary" variant="h5">
					There is no such Property!
				</Typography>
				<Button className="mt-24" component={Link} variant="outlined" to="/property" color="inherit">
					Go to Properties Page
				</Button>
			</motion.div>
		);
	}

	/**
	 * Wait while product data is loading and form is setted
	 */

	if (_.isEmpty(form)) {
		return <FuseLoading />;
	}

	return (
		<FormProvider {...methods}>
			<FusePageCarded
				classes={{
					toolbar: 'p-0',
					header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
				}}
				header={<EventHeader isOldProduct={isOldProduct} />}
				contentToolbar={
					<Tabs
						value={tabValue}
						onChange={handleTabChange}
						indicatorColor="primary"
						textColor="primary"
						variant="scrollable"
						scrollButtons="auto"
						classes={{ root: 'w-full h-64' }}
					>
						<Tab className="h-64" label="Property Info" />
						<Tab className="h-64" label="Property Address" />
						<Tab className="h-64" label="Property Images" />
					</Tabs>
				}
				content={
					<div className="p-16 sm:p-24 max-w-2xl">
						<div className={tabValue !== 0 ? 'hidden' : ''}>
							<BasicInfoTab isOldProduct={isOldProduct} product={product} />
						</div>
						<div className={tabValue !== 1 ? 'hidden' : ''}>
							<PropertyAddress isOldProduct={isOldProduct} />
						</div>
						<div className={tabValue !== 2 ? 'hidden' : ''}>
							<TimingInfo isOldProduct={isOldProduct} />
						</div>
					</div>
				}
				innerScroll
			/>
		</FormProvider>
	);
}

export default withReducer('EventCommerceApp', reducer)(Event);
