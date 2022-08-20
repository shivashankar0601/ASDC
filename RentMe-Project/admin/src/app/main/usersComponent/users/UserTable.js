import FuseScrollbars from '@fuse/core/FuseScrollbars';
import _ from '@lodash';
import Checkbox from '@material-ui/core/Checkbox';
import Icon from '@material-ui/core/Icon';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import FuseLoading from '@fuse/core/FuseLoading';
import AppContext from 'app/AppContext';
import { API } from 'app/shared-components/API';
import { getUsers, selectProducts } from '../store/usersSlice';
import UsersTableHead from './UserTableHead';

function UsersTable({ page, setPage, rowsPerPage, setRowsPerPage, ...props }) {
	const dispatch = useDispatch();
	const products = useSelector(selectProducts);
	const searchText = useSelector(({ UsersCommerceApp }) => UsersCommerceApp.products.searchText);

	const [loading, setLoading] = useState(true);
	const [selected, setSelected] = useState([]);
	const [data, setData] = useState(products);

	const [totalCat, setTotalCat] = useState(0);
	const [order, setOrder] = useState({
		direction: 'asc',
		id: null
	});
	useEffect(() => {
		dispatch(getUsers({ setTotalCat, page, rowsPerPage, searchText, type: props.userType })).then(() =>
			setLoading(false)
		);
	}, [dispatch, page, rowsPerPage, searchText, props.userType]);

	useEffect(() => {
		setData([...products]);
	}, [products, searchText, setPage]);

	function handleRequestSort(event, property) {
		const id = property;
		let direction = 'desc';

		if (order.id === property && order.direction === 'desc') {
			direction = 'asc';
		}

		setOrder({
			direction,
			id
		});
	}

	function handleSelectAllClick(event) {
		if (event.target.checked) {
			setSelected(data.map(n => n.id));
			return;
		}
		setSelected([]);
	}

	function handleDeselect() {
		setSelected([]);
	}

	function handleClick(item) {
		props.history.push(`/user/${item.id}`);
	}

	function handleChangePage(event, value) {
		setPage(value);
	}

	function handleChangeRowsPerPage(event) {
		setRowsPerPage(event.target.value);
	}

	if (loading) {
		return <FuseLoading />;
	}

	if (data.length === 0) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-1 items-center justify-center h-full"
			>
				<Typography color="textSecondary" variant="h5">
					There are no Users!
				</Typography>
			</motion.div>
		);
	}

	return (
		<div className="w-full flex flex-col">
			<FuseScrollbars className="flex-grow overflow-x-auto">
				<Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle">
					<UsersTableHead
						selectedProductIds={selected}
						order={order}
						onSelectAllClick={handleSelectAllClick}
						onRequestSort={handleRequestSort}
						rowCount={data.length}
						onMenuItemClick={handleDeselect}
					/>

					<TableBody>
						{_.orderBy(
							data,
							[
								o => {
									switch (order.id) {
										case 'categories': {
											return o.categories[0];
										}
										default: {
											return o[order.id];
										}
									}
								}
							],
							[order.direction]
						).map(n => {
							const isSelected = selected.indexOf(n.id) !== -1;
							return (
								<TableRow
									className="h-72 cursor-pointer"
									hover
									role="checkbox"
									aria-checked={isSelected}
									tabIndex={-1}
									key={n.id}
									selected={isSelected}
									onClick={() => handleClick(n)}
								>
									{/* <TableCell className="w-52 px-4 md:px-0" component="th" scope="row" padding="none">
										<img
											className="w-full block rounded"
											src="assets/images/ecommerce/product-image-placeholder.png"
											alt="Fake"
										/>
									</TableCell> */}

									<TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
										{n.fullname}
									</TableCell>

									<TableCell
										className="p-4 md:p-16 truncate"
										component="th"
										scope="row"
										align="center"
									>
										{n.email}
									</TableCell>

									<TableCell
										className="p-4 md:p-16 truncate"
										component="th"
										scope="row"
										align="center"
									>
										{n.role?.name || ''}
									</TableCell>

									<TableCell className="p-4 md:p-16" component="th" scope="row" align="center">
										{new Date(n.createdAt).toUTCString()}
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</FuseScrollbars>

			<TablePagination
				className="flex-shrink-0 border-t-1"
				component="div"
				count={totalCat}
				rowsPerPage={rowsPerPage}
				page={page}
				backIconButtonProps={{
					'aria-label': 'Previous Page'
				}}
				nextIconButtonProps={{
					'aria-label': 'Next Page'
				}}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
			/>
		</div>
	);
}

export default withRouter(UsersTable);
