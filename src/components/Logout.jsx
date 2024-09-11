import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");

    // Optionally clear any other session-related data

    // Redirect the user to the login page or home page
    navigate("/login");
  };

  return (
    <div>
      <Button text="Log out" handleClick={handleLogout}></Button>
    </div>
  );
}

export default Logout;
