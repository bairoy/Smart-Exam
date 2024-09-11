import style from "./Logo.module.css";
import pic from "../assets/logo.png";
function Logo() {
  return (
    <div className={style["logo-container"]}>
      <img src={pic} alt="image" />
    </div>
  );
}
export default Logo;
