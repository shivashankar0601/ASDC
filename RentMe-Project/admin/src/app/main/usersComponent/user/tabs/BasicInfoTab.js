import { FormControlLabel, FormLabel, Radio, RadioGroup } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { Controller, useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';

function BasicInfoTab(props) {
	const data = useSelector(({ UserCommerceApp }) => UserCommerceApp.product);
	const methods = useFormContext();
	const { control, formState, setValue, watch } = methods;
	const { errors } = formState;

	return (
		<div>
			<Controller
				name="fullname"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						error={!!errors.fullname}
						required
						helperText={errors?.fullname?.message}
						label="Full Name"
						autoFocus
						id="fullname"
						variant="outlined"
						fullWidth
					/>
				)}
			/>

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
						disabled={props.isOldProduct}
					/>
				)}
			/>
			<Controller
				name="password"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						error={!!errors.password}
						required
						helperText={errors?.password?.message}
						label="Password"
						id="password"
						variant="outlined"
						fullWidth
						type="password"
					/>
				)}
			/>
			<Controller
				name="role"
				control={control}
				render={({ field }) => (
					<>
						<FormLabel component="legend">Role</FormLabel>
						<RadioGroup {...field} aria-label="role" name="role" id="role">
							<FormControlLabel value="admin" control={<Radio />} label="admin" />
							<FormControlLabel value="landlord" control={<Radio />} label="landlord" />
							<FormControlLabel value="user" control={<Radio />} label="user" />
						</RadioGroup>
					</>
				)}
			/>
		</div>
	);
}

export default BasicInfoTab;
