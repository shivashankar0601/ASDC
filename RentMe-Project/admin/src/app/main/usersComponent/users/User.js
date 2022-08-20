import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import { useState } from 'react';
import reducer from '../store';
import UsersHeader from './UserHeader';
import UsersTable from './UserTable';

function Users() {
	const [userType, setUserType] = useState('ALL');
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	return (
		<FusePageCarded
			classes={{
				content: 'flex',
				contentCard: 'overflow-hidden',
				header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
			}}
			header={
				<UsersHeader
					userType={userType}
					setUserType={setUserType}
					setPage={setPage}
					setRowsPerPage={setRowsPerPage}
				/>
			}
			content={
				<UsersTable
					userType={userType}
					page={page}
					setPage={setPage}
					rowsPerPage={rowsPerPage}
					setRowsPerPage={setRowsPerPage}
				/>
			}
			innerScroll
		/>
	);
}

export default withReducer('UsersCommerceApp', reducer)(Users);
