const setCanvasPreview = (
	image, // HTMLImageElement
	canvas, // HTMLCanvasElement
	crop // PixelCrop
) => {
	const ctx = canvas.getContext("2d");
	if (!ctx) {
		throw new Error("No 2d context");
	}

	// devicePixelRatio slightly increases sharpness on retina devices
	// at the expense of slightly slower render times and needing to
	// size the image back down if you want to download/upload and be
	// true to the images natural size.

	const {width:cropWidth, height:cropHeight} = crop;

	const {naturalWidth:imageNaturalWidth, naturalHeight:imageNaturalHeight, width:imageWidth, height:imageHeight} = image;

	const pixelRatio = window.devicePixelRatio;
	const scaleX = imageNaturalWidth / imageWidth;
	const scaleY = imageNaturalHeight / imageHeight;

	canvas.width = cropWidth ? Math.floor(cropWidth * scaleX * pixelRatio) : imageNaturalWidth;
	canvas.height = cropHeight ? Math.floor(cropHeight * scaleY * pixelRatio) : imageNaturalHeight;

	ctx.scale(pixelRatio, pixelRatio);
	ctx.imageSmoothingQuality = "high";
	ctx.save();

	const cropX = (cropWidth ? crop.x : 100) * scaleX;
	const cropY = (cropHeight? crop.y : 100) * scaleY;

	// Move the crop origin to the canvas origin (0,0)
	ctx.translate(-cropX, -cropY);
	ctx.drawImage(
		image,
		0,
		0,
		image.naturalWidth,
		image.naturalHeight,
		0,
		0,
		image.naturalWidth,
		image.naturalHeight
	);

	ctx.restore();
};
export default setCanvasPreview;