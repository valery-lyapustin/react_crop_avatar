import { useEffect, useState } from "react";
import 'react-image-crop/dist/ReactCrop.css'
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";

import styles from "./style.module.css";
import Button from "../Buttons/Button/Button";
import { useAppContext } from "../../contexts/AppContext/AppContextProvider";
import setCanvasPreview from "../../utils/setCanvasPreview";

const ImageCropModal = ({ show, closeModalDlg = () => { }, image: imgFile }) => {
	const isShow = show || false;
	const modalDialogActiveClassName = isShow ? [styles["show"]].join(" ") : "";

	const store = useAppContext();
	const { image, sizes } = store;
	const { name: fileName, file, img, base64: imgBase64 } = image.get();
	const { width, height, ratio } = sizes;

	const { value: imageWidth, original: imageOriginalWidth } = width;
	const { value: imageHeight, original: imageOriginalHeight } = height;

	const imageWidthValue = imageWidth.get();
	const imageHeightValue = imageHeight.get();
	const imageRatioValue = ratio.value;

	const [crop, setCrop] = useState();
	const handleCloseModalDlg = () => {
		closeModalDlg();
	}

	function toBlob(canvas) {
		return new Promise((resolve) => {
			canvas.toBlob(resolve)
		})
	}

	const handleChangePreview = (pixelCrop, percentCrop) => {
		setCrop(percentCrop);
		console.log(pixelCrop, percentCrop)
	}

	const handleCropImage = async () => {
		//console.log(img, crop)
		const dummyCanvas = document.createElement("canvas");
		dummyCanvas.width = imageWidthValue;
		dummyCanvas.height = imageHeightValue;

		const ctx = dummyCanvas.getContext('2d');
		ctx.drawImage(img, 0, 0, imageWidthValue, imageHeightValue);

		setCanvasPreview(img, dummyCanvas, crop);

		const blob = await toBlob(dummyCanvas);
		const previewUrl = URL.createObjectURL(blob)

		//console.log(img, dummyCanvas, crop)

		console.log(previewUrl)
	}

	const handleCropComplete = (data) => {
		console.log(data.cropperCrop); // Получить координаты обрезки
		console.log(data.croppedImageSrc); // Получить URL-адрес обрезанного изображения
		// Здесь вы можете сохранить обрезанное изображение или загрузить его на сервер
	 };

	useEffect(() => {
		const crop = centerCrop(
			makeAspectCrop(
				{
					// You don't need to pass a complete crop into
					// makeAspectCrop or centerCrop.
					unit: '%',
					width: 25,
				},
				imageRatioValue,
				imageWidthValue,
				imageHeightValue
			),
			imageWidthValue,
			imageHeightValue
		);

		setCrop(crop);
	}, []);

	if (!imgFile) return null;

	return (
		<div className={[styles.modal, modalDialogActiveClassName].join(" ")}>
			<div className={styles["modal-dialog"]}>
				<div className={styles["modal-content"]}>
					<div className={styles["modal-header"]}>
						<h3 className={styles["modal-title"]}>Заголовок модального окна</h3>
						<button type="button" title="Close" className={styles["close-btn"]} onClick={handleCloseModalDlg}>x</button>
					</div>
					<div className={styles["modal-body"]}>
						<div className={styles["modal-body-content"]}>
							<ReactCrop className={styles["ReactCrop"]} crop={crop} onChange={handleChangePreview} onComplete={handleCropComplete}>
								<img className={styles["modal-img"]} src={imgFile} alt="Изображение модального окна" />
							</ReactCrop>
							<Button className={styles["CropBtn"]} onClick={handleCropImage}>Обрезать изображение</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ImageCropModal;