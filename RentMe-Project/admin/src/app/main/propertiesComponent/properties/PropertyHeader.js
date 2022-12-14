import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import { ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { setProductsSearchText } from '../store/propertiesSlice';

function EventsHeader(props) {
	const dispatch = useDispatch();
	const searchText = useSelector(({ EventsCommerceApp }) => EventsCommerceApp.products.searchText);
	const mainTheme = useSelector(selectMainTheme);

	return (
		<>
			<div className="flex flex-1 w-full items-center justify-between">
				<div className="flex items-center">
					<Typography
						component={motion.span}
						initial={{ x: -20 }}
						animate={{ x: 0, transition: { delay: 0.2 } }}
						delay={300}
						className="hidden sm:flex text-16 md:text-24 mx-12 font-semibold"
					>
						Properties
					</Typography>
				</div>

				<div className="flex flex-1 items-center justify-center px-12">
					<ThemeProvider theme={mainTheme}>
						<Paper
							component={motion.div}
							initial={{ y: -20, opacity: 0 }}
							animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
							className="flex items-center max-w-250 px-8 py-4 rounded-16 shadow"
						>
							<Icon color="action">search</Icon>

							<Input
								placeholder="Search"
								className="flex flex-1 mx-8"
								disableUnderline
								fullWidth
								value={searchText}
								inputProps={{
									'aria-label': 'Search'
								}}
								onChange={ev => dispatch(setProductsSearchText(ev))}
							/>
						</Paper>
					</ThemeProvider>
				</div>

				<motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}>
					<Button
						component={Link}
						to="/property/new"
						className="whitespace-nowrap"
						variant="contained"
						color="secondary"
					>
						<Icon
							component={motion.span}
							initial={{ scale: 0 }}
							animate={{ scale: 1, transition: { delay: 0.2 } }}
							className="text-20 md:text-25"
						>
							add
						</Icon>
					</Button>
				</motion.div>
			</div>
		</>
	);
}

export default EventsHeader;
