/* eslint-disable no-plusplus */
import FuseUtils from '@fuse/utils';
import { Button, ButtonGroup, CircularProgress, Typography } from '@material-ui/core';
import { orange } from '@material-ui/core/colors';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import { API } from 'app/shared-components/API';
import axios from 'axios';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

const useStyles = makeStyles(theme => ({
	productImageFeaturedStar: {
		position: 'absolute',
		top: 0,
		right: 0,
		color: orange[400],
		opacity: 0
	},
	productImageUpload: {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut
	},
	productImageItem: {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut,
		'&:hover': {
			'& $productImageFeaturedStar': {
				opacity: 0.8
			}
		},
		'&.featured': {
			pointerEvents: 'none',
			boxShadow: theme.shadows[3],
			'& $productImageFeaturedStar': {
				opacity: 1
			},
			'&:hover $productImageFeaturedStar': {
				opacity: 1
			}
		}
	}
}));

function PropertyImagesTab(props) {
	const classes = useStyles(props);
	const methods = useFormContext();
	const { control, watch, setValue, getValues } = methods;

	const [selectedFile, setSelectedFile] = useState([]);
	const [imageCred, setImageCred] = useState([]);
	const [errorMsg, setErrorMsg] = useState(null);
	const [isUploading, setIsUploading] = useState(false);
	const [myImages, setMyImages] = useState([]);
	const [savedImages, setSavedImages] = useState([]);

	const handleImageUpload = () => {
		setIsUploading(true);
		// eslint-disable-next-line prefer-const
		let formData = new FormData();
		console.log(selectedFile.length);
		for (let i = 0; i < selectedFile.length; i++) {
			formData.append('files', selectedFile[i]);
		}

		axios
			.post(`${API}/media-uploader/upload/images`, formData, {
				headers: {
					'content-type': 'multipart/form-data'
				}
			})
			.then(response => {
				const finalData = [];
				response.data.forEach(item => {
					finalData.push({
						imageUrl: item.secure_url,
						imagePublicId: item.public_id
					});
				});
				setImageCred([...finalData]);
				setValue('displayImage', finalData[0].secure_url || '');
				setValue('displayImagePublicId', finalData[0].public_id || '');
				setValue('images', finalData);
			})
			.catch(error => {
				setErrorMsg(error.isAxiosError ? error.response.data.message : error.message);
			})
			.finally(() => setIsUploading(false));
	};

	useEffect(() => {
		setSavedImages(getValues('propertiesImages'));
	}, [getValues]);

	return (
		<div>
			<div className="flex justify-center sm:justify-start flex-wrap -mx-16">
				{!props.isOldProduct && (
					<Controller
						name="displayImage"
						control={control}
						render={() => (
							<label
								htmlFor="button-file-image"
								className={clsx(
									classes.productImageUpload,
									'flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer shadow hover:shadow-lg'
								)}
							>
								<input
									accept="image/*"
									className="hidden"
									id="button-file-image"
									type="file"
									onChange={async e => {
										setSelectedFile(old => [...old, e.target.files[0]]);
										function readFileAsync() {
											return new Promise((resolve, reject) => {
												const file = e.target.files[0];
												if (!file) {
													return;
												}
												const reader = new FileReader();

												reader.onload = () => {
													resolve({
														id: FuseUtils.generateGUID(),
														url: `data:${file.type};base64,${btoa(reader.result)}`,
														type: 'image'
													});
												};

												reader.onerror = reject;

												reader.readAsBinaryString(file);
											});
										}

										const newImage = await readFileAsync();

										setMyImages(old => [...old, newImage]);
										// onChange([newImage]);
									}}
								/>
								<Icon fontSize="large" color="action">
									cloud_upload
								</Icon>
							</label>
						)}
					/>
				)}

				{props.isOldProduct ? (
					<Controller
						name="displayImage"
						control={control}
						defaultValue=""
						render={() =>
							savedImages.map((media, index) => (
								<div
									key={index}
									role="button"
									tabIndex={0}
									className={clsx(
										classes.productImageItem,
										'flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden  outline-none shadow hover:shadow-lg'
									)}
								>
									<img className="max-w-none w-auto h-full" src={media.imageUrl} alt="product" />
								</div>
							))
						}
					/>
				) : (
					<Controller
						name="displayImage"
						control={control}
						defaultValue=""
						render={() =>
							myImages.map((media, index) => (
								<div
									key={index}
									role="button"
									tabIndex={0}
									className={clsx(
										classes.productImageItem,
										'flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden  outline-none shadow hover:shadow-lg'
									)}
								>
									<img className="max-w-none w-auto h-full" src={media.url} alt="product" />
								</div>
							))
						}
					/>
				)}
			</div>
			{!myImages.length && getValues('displayImage') && (
				<div
					role="button"
					tabIndex={0}
					className={clsx(
						classes.productImageItem,
						'flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden  outline-none shadow hover:shadow-lg'
					)}
				>
					<img className="max-w-none w-auto h-full" src={getValues('displayImage')} alt="product" />
				</div>
			)}
			<div style={{ margin: '15px 0' }}>
				<Typography variant="h6" color="error">
					{errorMsg || ''}
				</Typography>
			</div>
			{!props.isOldProduct && (
				<Button
					className="whitespace-nowrap mx-4"
					variant="contained"
					color="secondary"
					onClick={handleImageUpload}
					disabled={!selectedFile && !imageCred.length}
					startIcon={<Icon className="hidden sm:flex">backup</Icon>}
				>
					{isUploading ? <CircularProgress /> : imageCred.length ? 'Uploaded' : 'Upload'}
				</Button>
			)}
		</div>
	);
}

export default PropertyImagesTab;
