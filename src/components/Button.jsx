import styles from "./Button.module.css";
function Button({ text, handleClick }) {
  return (
    <button onClick={handleClick} className={styles["btnclass"]}>
      {text}
    </button>
  );
}
export default Button;
