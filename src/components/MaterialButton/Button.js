import styles from "./style.module.css";

const Button = ({children, onClick=()=>{}})=>{
	return <button className={styles.btn} type="button" onClick={onClick}>{children}</button>
}

export default Button;