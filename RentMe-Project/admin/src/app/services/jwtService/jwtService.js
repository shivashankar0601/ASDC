import FuseUtils from '@fuse/utils/FuseUtils';
import { API } from 'app/shared-components/API';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
/* eslint-disable camelcase */

class JwtService extends FuseUtils.EventEmitter {
	init() {
		this.setInterceptors();
		this.handleAuthentication();
	}

	setInterceptors = () => {
		axios.interceptors.response.use(
			response => {
				return response;
			},
			err => {
				return new Promise((resolve, reject) => {
					if (err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
						// if you ever get an unauthorized response, logout the user
						this.emit('onAutoLogout', 'Invalid access_token');
						this.setSession(null);
					}
					throw err;
				});
			}
		);
	};

	handleAuthentication = () => {
		const access_token = this.getAccessToken();

		if (!access_token) {
			this.emit('onNoAccessToken');
			return;
		}

		if (this.isAuthTokenValid(access_token)) {
			this.setSession(access_token);
			this.emit('onAutoLogin', true);
		} else {
			this.setSession(null);
			this.emit('onAutoLogout', 'access_token expired');
		}
	};

	createUser = data => {
		return new Promise((resolve, reject) => {
			axios
				.post(`${API}/auth/register/landlord`, data)
				.then(response => {
					if (response.data.user) {
						this.setSession(response.data.accessToken);
						resolve(response.data.user);
					} else {
						// eslint-disable-next-line prefer-promise-reject-errors
						reject(['Unauthorized Login']);
					}
				})
				.catch(error => {
					// eslint-disable-next-line prefer-promise-reject-errors
					reject(error.isAxiosError ? [error.response.data.message] : [error.message]);
				});
		});
	};

	signInWithEmailAndPassword = (email, password) => {
		return new Promise((resolve, reject) => {
			axios
				.post(`${API}/auth/login`, {
					email,
					password
				})
				.then(response => {
					if (
						response.data.user &&
						(response.data.user.role.name === 'admin' || response.data.user.role.name === 'landlord')
					) {
						this.setSession(response.data.accessToken);
						resolve(response.data.user);
					} else {
						// eslint-disable-next-line prefer-promise-reject-errors
						reject(['Unauthorized Login']);
					}
				})
				.catch(error => {
					// eslint-disable-next-line prefer-promise-reject-errors
					reject(error.isAxiosError ? [error.response.data.message] : [error.message]);
				});
		});
	};

	signInWithToken = () => {
		return new Promise((resolve, reject) => {
			axios
				.post(`${API}/auth/accessToken`, { access_token: this.getAccessToken() })
				.then(response => {
					if (
						response.data.user &&
						(response.data.user.role.name === 'admin' || response.data.user.role.name === 'landlord')
					) {
						this.setSession(response.data.accessToken);
						resolve(response.data.user);
					} else {
						this.logout();
						reject(new Error('Failed to login with token.'));
					}
				})
				.catch(error => {
					this.logout();
					reject(new Error('Failed to login with token.'));
				});
		});
	};

	updateUserData = user => {
		return axios.post('/api/auth/user/update', {
			user
		});
	};

	setSession = access_token => {
		if (access_token) {
			localStorage.setItem('jwt_access_token', access_token);
			axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
		} else {
			localStorage.removeItem('jwt_access_token');
			delete axios.defaults.headers.common.Authorization;
		}
	};

	logout = () => {
		this.setSession(null);
	};

	isAuthTokenValid = access_token => {
		if (!access_token) {
			return false;
		}
		const decoded = jwtDecode(access_token);
		const currentTime = Date.now() / 1000;
		if (decoded.exp < currentTime) {
			console.warn('access token expired');
			return false;
		}

		return true;
	};

	getAccessToken = () => {
		return window.localStorage.getItem('jwt_access_token');
	};
}

const instance = new JwtService();

export default instance;
