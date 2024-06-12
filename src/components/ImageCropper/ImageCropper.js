import { useRef, useState } from "react";
import ReactCrop, {
	centerCrop,
	convertToPixelCrop,
	makeAspectCrop,
} from "react-image-crop";
import setCanvasPreview from "../../utils/setCanvasPreview";
import dataURLtoFile from "../../utils/dataURLtoFile";
import { useAppContext } from "../../contexts/AppContext/AppContextProvider";

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;

const ImageCropper = ({ closeModal }) => {
	const store = useAppContext();
	const { image } = store;
	const { name: imageName, base64: imageBase64 } = image.get();

	const imgRef = useRef(null);
	const previewCanvasRef = useRef(null);
	const [crop, setCrop] = useState();

	const onSelectFile = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;

		image.set(file);
	};

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
			<label className="block mb-3 w-fit">
				<span className="sr-only">Choose profile photo</span>
				<input
					type="file"
					accept="image/*"
					onChange={onSelectFile}
					className="block w-full text-sm text-slate-500 file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:bg-gray-700 file:text-sky-300 hover:file:bg-gray-600"
				/>
			</label>
			{imageBase64 && (
				<div className="flex flex-col items-center">
					<ReactCrop
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
					<button
						className="text-white font-mono text-xs py-2 px-4 rounded-2xl mt-4 bg-sky-500 hover:bg-sky-600"
						onClick={handleSetCanvasPreview}
					>
						Crop Image
					</button>
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