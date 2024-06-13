import { useRef, useState } from "react";
import ReactCrop, {
	centerCrop,
	convertToPixelCrop,
	makeAspectCrop,
} from "react-image-crop";

import 'react-image-crop/dist/ReactCrop.css'
import setCanvasPreview from "../../utils/setCanvasPreview";
import dataURLtoFile from "../../utils/dataURLtoFile";
import { useAppContext } from "../../contexts/AppContext/AppContextProvider";
import Button from "../MaterialButton/Button";
import styles from "./style.module.css";

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;

const ImageCropper = ({ closeModal }) => {
	const store = useAppContext();
	const { image } = store;
	const { name: imageName, base64: imageBase64 } = image.get();

	const imgRef = useRef(null);
	const previewCanvasRef = useRef(null);
	const [crop, setCrop] = useState(null);

	const onImageLoad = (e) => {
		const { width, height } = e.currentTarget;
		const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

		const crop = makeAspectCrop(
			{
				unit: "%",
				width: cropWidthInPercent,
			},
			ASPECT_RATIO,
			width,
			height
		);
		const centeredCrop = centerCrop(crop, width, height);
		setCrop(centeredCrop);
	};

	const handleSetCanvasPreview = () => {
		setCanvasPreview(
			imgRef.current, // HTMLImageElement
			previewCanvasRef.current, // HTMLCanvasElement
			convertToPixelCrop(
				crop,
				imgRef.current.width,
				imgRef.current.height
			)
		);

		const dataUrl = previewCanvasRef.current.toDataURL();
		const croppedFile = dataURLtoFile(dataUrl, imageName);
		image.set(croppedFile);
		closeModal();
	}

	return (
		<>
			{imageBase64 && (
				<div className="flex flex-col items-center">
					<ReactCrop
						className={styles["cropper"]}
						crop={crop}
						onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
					>
						<img
							ref={imgRef}
							src={imageBase64}
							alt="Upload"
							style={{ maxHeight: "70vh" }}
							onLoad={onImageLoad}
						/>
					</ReactCrop>
					<Button ыч onClick={handleSetCanvasPreview}>Обрезать изображение</Button>
				</div>
			)}
			{crop && (
				<canvas
					ref={previewCanvasRef}
					className="mt-4"
					style={{
						display: "none",
						border: "1px solid black",
						objectFit: "contain",
						width: 150,
						height: 150,
					}}
				/>
			)}
		</>
	);
};
export default ImageCropper;