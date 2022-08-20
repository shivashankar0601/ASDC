import { FormControl, InputLabel, MenuItem, OutlinedInput, Select } from '@material-ui/core';
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
import { setProductsSearchText } from '../store/usersSlice';

function UsersHeader(props) {
	const dispatch = useDispatch();
	const searchText = useSelector(({ UsersCommerceApp }) => UsersCommerceApp.products.searchText);
	const mainTheme = useSelector(selectMainTheme);

	return (
		<div className="flex flex-1 w-full items-center justify-between">
			<div className="flex items-center">
				<Icon
					component={motion.span}
					initial={{ scale: 0 }}
					animate={{ scale: 1, transition: { delay: 0.2 } }}
					className="text-24 md:text-32"
				>
					people
				</Icon>
				<Typography
					component={motion.span}
					initial={{ x: -20 }}
					animate={{ x: 0, transition: { delay: 0.2 } }}
					delay={300}
					className="hidden sm:flex text-16 md:text-24 mx-12 font-semibold"
				>
					Users
				</Typography>
			</div>

			<div className="flex flex-1 items-center justify-center px-12">
				<ThemeProvider theme={mainTheme}>
					<Paper
						component={motion.div}
						initial={{ y: -20, opacity: 0 }}
						animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
						className="flex items-center w-full max-w-512 px-8 py-4 rounded-16 shadow"
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
			<div>
				<FormControl className="flex w-full sm:w-320 mx-16" variant="outlined">
					<InputLabel htmlFor="category-label-placeholder"> Category </InputLabel>
					<Select
						value={props.userType}
						onChange={event => {
							props.setPage(0);
							props.setRowsPerPage(10);
							props.setUserType(event.target.value);
						}}
						input={
							<OutlinedInput
								labelWidth={'category'.length * 9}
								name="category"
								id="category-label-placeholder"
							/>
						}
					>
						<MenuItem value="ALL">
							<em> All </em>
						</MenuItem>
						<MenuItem value="USER">
							<em> User </em>
						</MenuItem>
						<MenuItem value="LANDLORD">
							<em> Landlord </em>
						</MenuItem>
						<MenuItem value="ADMIN">
							<em> Admin </em>
						</MenuItem>
					</Select>
				</FormControl>
			</div>
			<motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}>
				<Button
					component={Link}
					to="/user/new"
					className="whitespace-nowrap"
					variant="contained"
					color="secondary"
				>
					<span className="hidden sm:flex">Add New User</span>
					<span className="flex sm:hidden">New</span>
				</Button>
			</motion.div>
		</div>
	);
}

export default UsersHeader;
