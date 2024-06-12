import ProfileAvatar from "../../assets/profile.png";
import ModalDlg from "../ModalDlg/ModalDlg";
import { useAppContext } from "../../contexts/AppContext/AppContextProvider";
import styles from "./style.module.css";

const Profile = () => {
	const store = useAppContext();
	const {cropModalDlg, image} = store;
	const showCropModalDlg = cropModalDlg.get();
	const {base64:imageBase64} = image.get();

	const handleShowCropModalDlg = ()=>{
		cropModalDlg.set(true);
	}

	const handleHideCropModalDlg = ()=>{
		cropModalDlg.set(false);
	}

	return (
		<div className="flex flex-col items-center pt-12">
			<div className="relative">
				<img
					src={imageBase64 || ProfileAvatar}
					alt="Avatar"
					className={["w-[150px] h-[150px] rounded-full border-2 border-gray-400", styles.avatar].join(" ")}
					onClick={handleShowCropModalDlg}
				/>
			</div>
			{showCropModalDlg && ( <ModalDlg closeModal={handleHideCropModalDlg} /> )}
		</div>
	);
};

export default Profile;