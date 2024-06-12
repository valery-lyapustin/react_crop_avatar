import ProfileAvatar from "../../assets/profile.png";
import { useAppContext } from "../../contexts/AppContext/AppContextProvider";
import styles from "./style.module.css";
import ImageCropModal from "../ImageCropModal/ImageCropModal";
import Button from "../MaterialButton/Button";

const Profile = () => {
	const store = useAppContext();
	const { cropModalDlg, image } = store;
	const showCropModalDlg = cropModalDlg.get();
	const { base64: imageBase64, name:imageFileName } = image.get();

	const handleShowCropModalDlg = () => {
		cropModalDlg.set(true);
	}

	const handleHideCropModalDlg = () => {
		cropModalDlg.set(false);
	}

	const handleSelectFile = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;

		image.set(file);
		handleShowCropModalDlg();
	}

	const handleClickFileInput = (e)=>{
		e.target.value = null;
	}

	const downloadCroppedImage = ()=>{
		const link = document.createElement("a");
		link.download = imageFileName;
		link.href = imageBase64;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	return (
		<div className="flex flex-col items-center pt-12">
			<div className="relative">
				<label
					className={["w-[150px] h-[150px] rounded-full border-2 border-gray-400", styles.avatar].join(" ")}
					style={{
						backgroundImage: `url(${imageBase64 || ProfileAvatar})`,
						backgroundPosition: 'center',
						backgroundSize: 'cover',
						backgroundRepeat: 'no-repeat'
					}}
				>
					<input type="file" accept="image/*" onClick={handleClickFileInput} onChange={handleSelectFile} />
				</label>
			</div>
			{imageBase64 && showCropModalDlg && (<ImageCropModal show={showCropModalDlg} closeModalDlg={handleHideCropModalDlg} />)}
			{imageBase64 && (<Button onClick={downloadCroppedImage}>Скачать изображение</Button>)}
		</div>
	);
};

export default Profile;