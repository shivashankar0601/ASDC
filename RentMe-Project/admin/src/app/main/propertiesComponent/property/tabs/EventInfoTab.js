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

function BasicInfoTab(props) {
	const classes = useStyles();
	const methods = useFormContext();
	const { control, formState, setValue, watch } = methods;
	const { errors } = formState;
	const location = useLocation();

	return (
		<div>
			<Controller
				name="title"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						error={!!errors.title}
						required
						helperText={errors?.title?.message}
						label="title"
						autoFocus
						id="title"
						variant="outlined"
						fullWidth
					/>
				)}
			/>
			<Controller
				name="description"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						error={!!errors.description}
						helperText={errors?.description?.message}
						label="Description"
						id="description"
						variant="outlined"
						fullWidth
					/>
				)}
			/>
			{/* 
			<Controller
				name="email"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						error={!!errors.email}
						required
						helperText={errors?.email?.message}
						label="Email"
						id="email"
						variant="outlined"
						fullWidth
						type="email"
						disabled
					/>
				)}
			/> 
			*/}
			<Controller
				name="price"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						error={!!errors.price}
						helperText={errors?.price?.message}
						label="price"
						id="price"
						variant="outlined"
						fullWidth
						type="number"
					/>
				)}
			/>
			<Controller
				name="bedrooms"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						error={!!errors.bedrooms}
						helperText={errors?.bedrooms?.message}
						label="bedrooms"
						id="bedrooms"
						variant="outlined"
						fullWidth
						type="number"
					/>
				)}
			/>
			<Controller
				name="bathrooms"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						error={!!errors.bathrooms}
						helperText={errors?.bathrooms?.message}
						label="bathrooms"
						id="bathrooms"
						variant="outlined"
						fullWidth
						type="number"
					/>
				)}
			/>
			<Controller
				name="size"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						error={!!errors.size}
						helperText={errors?.size?.message}
						label="size"
						id="size"
						variant="outlined"
						fullWidth
						type="number"
					/>
				)}
			/>
			<Controller
				name="url"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						error={!!errors.url}
						helperText={errors?.url?.message}
						label="Optional URL"
						id="url"
						variant="outlined"
						fullWidth
					/>
				)}
			/>
		</div>
	);
}

export default BasicInfoTab;
