import FusePageCarded from '@fuse/core/FusePageCarded';
import withReducer from 'app/store/withReducer';
import { useState } from 'react';
import reducer from '../store';
import EventsHeader from './PropertyHeader';
import EventsTable from './PropertyTable';

function Properties() {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [userType, setUserType] = useState('ALL');
	return (
		<FusePageCarded
			classes={{
				content: 'flex',
				contentCard: 'overflow-hidden',
				header: 'min-h-72 h-72 sm:h-136 sm:min-h-136'
			}}
			header={
				<EventsHeader
					page={page}
					setPage={setPage}
					rowsPerPage={rowsPerPage}
					setRowsPerPage={setRowsPerPage}
					userType={userType}
					setUserType={setUserType}
				/>
			}
			content={
				<EventsTable
					page={page}
					setPage={setPage}
					rowsPerPage={rowsPerPage}
					setRowsPerPage={setRowsPerPage}
					userType={userType}
					setUserType={setUserType}
				/>
			}
			innerScroll
		/>
	);
}

export default withReducer('EventsCommerceApp', reducer)(Properties);
