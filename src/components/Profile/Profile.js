import ProfileAvatar from "../../assets/profile.png";
import ModalDlg from "../ModalDlg/ModalDlg";
import { useAppContext } from "../../contexts/AppContext/AppContextProvider";
import styles from "./style.module.css";

const Profile = () => {
	const store = useAppContext();
	const { cropModalDlg, image } = store;
	const showCropModalDlg = cropModalDlg.get();
	const { base64: imageBase64 } = image.get();

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
			{imageBase64 && showCropModalDlg && (<ModalDlg closeModal={handleHideCropModalDlg} />)}
		</div>
	);
};

export default Profile;