import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header.jsx";
import UserDashboardHeader from "./UserDashboardHeader.jsx";

function Layout({ children }) {
  const location = useLocation();

  // Conditionally render Header based on the current path
  const renderHeader = () => {
    switch (location.pathname) {
      case "/dashboard":
        return <UserDashboardHeader />;
      case "/proctordashboard":
        return <UserDashboardHeader />;

      default:
        return <Header />;
    }
  };

  return (
    <div>
      {renderHeader()}
      <main>{children}</main>
    </div>
  );
}

export default Layout;
