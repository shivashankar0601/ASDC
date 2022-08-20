import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { useDeepCompareEffect } from '@fuse/hooks';
import { yupResolver } from '@hookform/resolvers/yup';
import _ from '@lodash';
import { Icon } from '@material-ui/core';
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
import { getUser, newProduct, resetProduct } from '../store/userSlice';
import BasicInfoTab from './tabs/BasicInfoTab';
import UserHeader from './UserHeader';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
	fullname: yup.string().required().trim().min(3),
	email: yup.string().required().email(),
	password: yup.string().required().trim().min(8)
});

function User(props) {
	const dispatch = useDispatch();
	const product = useSelector(({ UserCommerceApp }) => UserCommerceApp.product);
	const routeParams = useParams();
	const [tabValue, setTabValue] = useState(0);
	const [noProduct, setNoProduct] = useState(false);
	const [bulkInsert, setBulkInsert] = useState(false);
	const [isOldProduct, setIsOldProduct] = useState(false);
	const methods = useForm({
		mode: 'onChange',
		defaultValues: {},
		resolver: isOldProduct ? null : yupResolver(schema)
	});
	const { reset, watch } = methods;
	const form = watch();
	const role = watch('role');

	useDeepCompareEffect(() => {
		function updateProductState() {
			const { productId } = routeParams;
			if (productId === 'new') {
				/**
				 * Create New Product data
				 */
				dispatch(newProduct());
			} else if (productId === 'bulk') {
				setBulkInsert(true);
				setNoProduct(true);
			} else {
				/**
				 * Get Product data
				 */
				dispatch(getUser(productId)).then(action => {
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
	if (bulkInsert) {
		return (
			<FormProvider {...methods}>
				<FusePageCarded
					classes={{
						toolbar: 'p-0',
						header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
					}}
					header={
						<div className="flex flex-1 w-full items-center justify-between">
							<div className="flex flex-col items-start max-w-full min-w-0">
								<motion.div
									initial={{ x: 20, opacity: 0 }}
									animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
								>
									<Typography
										className="flex items-center sm:mb-12"
										component={Link}
										role="button"
										to="/users"
										color="inherit"
									>
										<Icon className="text-20">arrow_back</Icon>
										<span className="hidden sm:flex mx-4 font-medium">Users</span>
									</Typography>
								</motion.div>
							</div>
						</div>
					}
					innerScroll
				/>
			</FormProvider>
		);
	}
	if (noProduct) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography color="textSecondary" variant="h5">
					There is no such User!
				</Typography>
				<Button className="mt-24" component={Link} variant="outlined" to="/soundbytes" color="inherit">
					Go to Users Page
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
				header={<UserHeader isOldProduct={isOldProduct} />}
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
						<Tab className="h-64" label="Basic Info" />
					</Tabs>
				}
				content={
					<div className="p-16 sm:p-24 max-w-2xl">
						<div className={tabValue !== 0 ? 'hidden' : ''}>
							<BasicInfoTab isOldProduct={isOldProduct} />
						</div>
					</div>
				}
				innerScroll
			/>
		</FormProvider>
	);
}

export default withReducer('UserCommerceApp', reducer)(User);
