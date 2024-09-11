// header.jsx
import styles from "./Header.module.css";
import Logo from "./Logo.jsx";
import AnchorTag from "./AnchorTag";
import Button from "./Button.jsx";

import { useNavigate } from "react-router-dom";

function Header() {
  const navElements = [
    { href: "#", text: "Feature" },
    { href: "#", text: "Support" },
  ];
  const navigate = useNavigate();

  const buttons = [
    { btnName: "Sign Up", btnLink: () => navigate("/signup") },
    { btnName: "Sign In", btnLink: () => navigate("/login") },
  ];

  return (
    <div className={styles.header}>
      <Logo />
      <div>
        {navElements.map((element, index) => (
          <AnchorTag key={index} href={element.href} text={element.text} />
        ))}
        {buttons.map((button, index) => (
          <Button
            key={index}
            text={button.btnName}
            handleClick={button.btnLink}
          />
        ))}
      </div>
    </div>
  );
}

export default Header;
