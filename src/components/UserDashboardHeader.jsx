import React from "react";
import styles from "./UserDashboardHeader.module.css";
import Logout from "./Logout";
import Logo from "./Logo";
import Today from "./Today";

function UserDashboardHeader() {
  return (
    <header className={styles.dashboardHeader}>
      <a href="#" target="_blank" rel="noopener noreferrer">
        <img
          className={styles.imgClass}
          src="../../public/menu.svg"
          alt="menu svg"
        />
      </a>
      <div>
        <Today></Today>
      </div>

      <div className={styles.divClass}>
        <Logo></Logo>
        <Logout></Logout>
      </div>
    </header>
  );
}

export default UserDashboardHeader;
