import { useCallback, useState } from "react";

export const useCreateAppContext = function () {
	const listFormats = [{ id: 0, name: "Выберите формат" }, { id: 1, code: "image/png", name: "PNG", suffix: "png" }, { "id": 2, code: "image/jpeg", name: "JPEG", suffix: "jpg" }]
	const [file, setFile] = useState(null);
	const [fileName, setFileName] = useState(null);
	const [fileBase64, setFileBase64] = useState(null);
	const [width, setWidth] = useState(0);
	const [originalWidth, setOriginalWidth] = useState(0);
	const [height, setHeight] = useState(0);
	const [originalHeight, setOriginalHeight] = useState(0);
	const [img, setImg] = useState(null);
	const [imgRatio, setImgRatio] = useState(0);
	const [imgQuality, setImgQuality] = useState(100);
	const [lockAspectRatio, setLockAspectRatio] = useState(true);
	const [reduceQuality, setReduceQuality] = useState(false);
	const [selectedFormat, setSelectedFormat] = useState(listFormats[0]);
	const [isLoading, setIsLoading] = useState(false);
	const [showCropModalDlg, setCropShowModalDlg] = useState(false); 

	const getImage = () => {
		return {
			name: fileName,
			base64: fileBase64,
			file,
			img
		}
	};
	
	const setImage = useCallback((f) => {
		if (typeof f === 'object' && f instanceof File) {
			const reader = new FileReader();
			reader.onload = ({ target }) => {

				const img = new Image();
				img.onload = () => {
					setImg(img);
					setWidth(img.naturalWidth);
					setOriginalWidth(img.naturalWidth);
					setHeight(img.naturalHeight);
					setOriginalHeight(img.naturalHeight);
					setImgRatio(img.naturalWidth / img.naturalHeight);
					setFile(f);
					setFileBase64(target.result);
					setFileName(f.name);

				};
				img.src = target.result;
			}
			reader.readAsDataURL(f);
		};
	});

	const getImageWidth = () => { return width };
	const setImageWidth = useCallback((w) => {
		if (!isNaN(w)) setWidth(w);
	});

	const getImageOriginalWidth = () => { return originalWidth };

	const getImageHeight = () => { return height };
	const setImageHeight = ((h) => {
		if (!isNaN(h)) setHeight(h);
	});
	
	const getImageOriginalHeight = () => { return originalHeight };

	const getImageQuality = () => { return imgQuality };
	const setImageQuality = ((v) => {
		if (!isNaN(v)) setImgQuality(v);
	});

	const getImageLockAspectRatio = () => { return lockAspectRatio };
	const setImageLockAspectRatio = (v) => { setLockAspectRatio(!!v) };

	const getImageReduceQuality = () => { return reduceQuality };
	const setImageReduceQuality = (v) => { setReduceQuality(!!v) };

	const getFormat = () => { return selectedFormat };
	const setFormat = (id) => { setSelectedFormat(listFormats.find((f) => f.id === id) || listFormats[0]) };

	const getLoading = () => { return isLoading };
	const setLoading = ((v) => setIsLoading(!!v));

	const getShowCropModalDlg = ()=> {return showCropModalDlg};
	const setShowCropModalDlg = (v)=> {setCropShowModalDlg(!!v)};

	const imageFile = { get: getImage, set: setImage };
	const imageWidth = { get: getImageWidth, set: setImageWidth };
	const imageOriginalWidth = { get: getImageOriginalWidth };
	const imageHeight = { get: getImageHeight, set: setImageHeight };
	const imageOriginalHeight = { get: getImageOriginalHeight };
	const imageRatio = { lock: { get: getImageLockAspectRatio, set: setImageLockAspectRatio }, value: imgRatio };
	const imageReduceQuality = { get: getImageReduceQuality, set: setImageReduceQuality };
	const imageQuality = { get: getImageQuality, set: setImageQuality };

	return {
		image: imageFile,
		sizes: { width: {value:imageWidth, original:imageOriginalWidth}, height: {value:imageHeight, original:imageOriginalHeight}, ratio: imageRatio },
		quality: { reduce_quality: imageReduceQuality, value: imageQuality },
		format: { list: listFormats, get: getFormat, set: setFormat },
		loading: { get: getLoading, set: setLoading },
		cropModalDlg:{get: getShowCropModalDlg, set:setShowCropModalDlg}
	};
}