import styles from "./AnchorTag.module.css";
function AnchorTag({ href, text }) {
  return (
    <>
      <a
        className={styles["anchor"]}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {text}
      </a>
    </>
  );
}
export default AnchorTag;
