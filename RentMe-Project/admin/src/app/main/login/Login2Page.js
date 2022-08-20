import { yupResolver } from '@hookform/resolvers/yup';
import _ from '@lodash';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import AppContext from 'app/AppContext';
import { submitLogin } from 'app/auth/store/loginSlice';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useContext, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
	root: {}
}));

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
	email: yup.string().email('You must enter a valid email').required('You must enter a email'),
	password: yup
		.string()
		.required('Please enter your password.')
		.min(6, 'Password is too short - should be 6 chars minimum.')
});

const defaultValues = {
	email: '',
	password: '',
	remember: true
};

function Login2Page() {
	const { user, setUser } = useContext(AppContext);
	const classes = useStyles();
	const [errorMsg, setErrorMsg] = useState('');
	const dispatch = useDispatch();
	const history = useHistory();
	const login = useSelector(({ auth }) => auth.login);

	const { control, formState, handleSubmit, reset, setError } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: yupResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;
	useEffect(() => {
		login.errors.forEach(error => {
			setErrorMsg(error);
			setError(error.type, {
				type: 'manual',
				message: error.message
			});
		});
	}, [login.errors, setError]);

	function onSubmit(model) {
		dispatch(submitLogin(model, setUser));
	}

	return (
		<div className={clsx(classes.root, 'flex flex-col flex-auto p-16 sm:p-24 md:flex-row md:p-0 overflow-hidden')}>
			<div className="flex flex-col flex-grow-0 items-center p-16 text-center md:p-128 md:items-start md:flex-shrink-0 md:flex-1 md:text-left">
				<motion.div
					initial={{ opacity: 0, scale: 0.6 }}
					animate={{ opacity: 1, scale: 1, transition: { delay: 0.1 } }}
				>
					<img className="w-128 mb-32" src="assets/images/logos/fuse.svg" alt="logo" />
				</motion.div>

				<motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}>
					<Typography className="text-32 sm:text-44 font-semibold leading-tight">
						Welcome <br />
						to the <br /> RentMe Admin!
					</Typography>
				</motion.div>

				<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.3 } }}>
					<Typography variant="subtitle1" className="mt-32 font-medium">
						Create. Manage. Organize.
					</Typography>
				</motion.div>
			</div>

			<Card
				component={motion.div}
				initial={{ x: 200 }}
				animate={{ x: 0 }}
				transition={{ bounceDamping: 0 }}
				className="w-full max-w-400 mx-auto m-16 md:m-0 rounded-20 md:rounded-none"
				square
				layout
			>
				<CardContent className="flex flex-col items-center justify-center p-16 sm:p-32 md:p-48 md:pt-128 ">
					<Typography variant="h6" className="mb-24 font-semibold text-18 sm:text-24">
						Login to your account
					</Typography>

					<form
						name="loginForm"
						noValidate
						className="flex flex-col justify-center w-full"
						onSubmit={handleSubmit(onSubmit)}
					>
						<Controller
							name="email"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-16"
									label="Email"
									autoFocus
									type="email"
									error={!!errors.email}
									helperText={errors?.email?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
						/>

						<Controller
							name="password"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-16"
									label="Password"
									type="password"
									error={!!errors.password}
									helperText={errors?.password?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
						/>
						<Typography variant="h6" color="error">
							{errorMsg || ''}
						</Typography>

						<Button
							variant="contained"
							color="primary"
							className="w-full mx-auto mt-16"
							aria-label="LOG IN"
							disabled={_.isEmpty(dirtyFields) || !isValid}
							type="submit"
						>
							Login
						</Button>

						<div className="flex flex-col items-center justify-center pt-32">
							<div>
								<span className="font-normal mr-8">New to RentMe?</span>
								<Link className="font-normal" to="/register">
									Create Account
								</Link>
							</div>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}

export default Login2Page;
