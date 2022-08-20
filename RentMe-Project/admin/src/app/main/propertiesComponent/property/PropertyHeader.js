import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { API } from 'app/shared-components/API';
import { motion } from 'framer-motion';
import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { removeEvent, saveEvent, updateEvent } from '../store/propertySlice';

function EventHeader(props) {
	const currentUser = useSelector(state => state.auth.user.data);
	const dispatch = useDispatch();
	const theme = useTheme();
	const history = useHistory();
	const methods = useFormContext();
	const { getValues, reset, watch } = methods;

	const name = watch('title');

	function handleRemoveProduct() {
		dispatch(removeEvent()).then(() => {
			history.push('/property');
		});
	}

	function handleSaveProduct() {
		dispatch(saveEvent(getValues())).then(() => {
			reset(getValues());
		});
	}

	const handleUpdateProduct = useCallback(() => {
		dispatch(updateEvent({ productData: getValues() }));
	}, [dispatch, getValues]);

	return (
		<div className="flex flex-1 w-full items-center justify-between">
			<div className="flex flex-col items-start max-w-full min-w-0">
				<motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}>
					<Typography
						className="flex items-center sm:mb-12"
						component={Link}
						role="button"
						to="/property"
						color="inherit"
					>
						<Icon className="text-20">{theme.direction === 'ltr' ? 'arrow_back' : 'arrow_forward'}</Icon>
						<span className="hidden sm:flex mx-4 font-medium">Properties</span>
					</Typography>
				</motion.div>

				<div className="flex items-center max-w-full">
					<motion.div
						className="hidden sm:flex"
						initial={{ scale: 0 }}
						animate={{ scale: 1, transition: { delay: 0.3 } }}
					>
						<img
							className="w-32 sm:w-48 rounded"
							src="assets/images/ecommerce/product-image-placeholder.png"
							alt="product"
						/>
					</motion.div>
					<div className="flex flex-col min-w-0 mx-8 sm:mc-16">
						<motion.div initial={{ x: -20 }} animate={{ x: 0, transition: { delay: 0.3 } }}>
							<Typography className="text-16 sm:text-20 truncate font-semibold">
								{name || 'New Property'}
							</Typography>
							<Typography variant="caption" className="font-medium">
								Property Details
							</Typography>
						</motion.div>
					</div>
				</div>
			</div>
			<motion.div
				className="flex"
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
			>
				{props.isOldProduct && (
					<Button
						className="whitespace-nowrap mx-4"
						variant="contained"
						color="secondary"
						onClick={handleRemoveProduct}
						startIcon={<Icon className="hidden sm:flex">delete</Icon>}
					>
						Remove
					</Button>
				)}

				{!props.isOldProduct ? (
					<Button
						className="whitespace-nowrap mx-4"
						variant="contained"
						color="secondary"
						onClick={handleSaveProduct}
					>
						Save
					</Button>
				) : (
					<Button
						className="whitespace-nowrap mx-4"
						variant="contained"
						color="secondary"
						onClick={handleUpdateProduct}
					>
						Update
					</Button>
				)}
			</motion.div>
		</div>
	);
}

export default EventHeader;
