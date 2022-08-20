import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Controller, useFormContext } from 'react-hook-form';
import { useLocation } from 'react-router';

const useStyles = makeStyles(theme => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120
	},
	selectEmpty: {
		marginTop: theme.spacing(2)
	}
}));

function PropertyAddress(props) {
	const classes = useStyles();
	const methods = useFormContext();
	const { control, formState, setValue, watch } = methods;
	const { errors } = formState;
	const location = useLocation();

	return (
		<div>
			<Controller
				name="address"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						error={!!errors.address}
						required
						helperText={errors?.address?.message}
						label="address"
						autoFocus
						id="address"
						variant="outlined"
						fullWidth
					/>
				)}
			/>
			<Controller
				name="latitude"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						error={!!errors.latitude}
						required
						helperText={errors?.latitude?.message}
						label="latitude"
						autoFocus
						id="latitude"
						variant="outlined"
						type="number"
						fullWidth
					/>
				)}
			/>
			<Controller
				name="longitude"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						error={!!errors.longitude}
						required
						helperText={errors?.longitude?.message}
						label="longitude"
						autoFocus
						id="longitude"
						variant="outlined"
						type="number"
						fullWidth
					/>
				)}
			/>
		</div>
	);
}

export default PropertyAddress;
