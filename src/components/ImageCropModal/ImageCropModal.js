import styles from "./style.module.css";
import ImageCropper from "../ImageCropper/ImageCropper";

const ImageCropModal = ({ show, closeModalDlg = () => { }}) => {
	const isShow = show || false;
	const modalDialogActiveClassName = isShow ? [styles["show"]].join(" ") : "";

	const handleCloseModalDlg = () => {
		closeModalDlg();
	};

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
							<ImageCropper closeModal={handleCloseModalDlg} />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ImageCropModal;