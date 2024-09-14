import React from "react";
import { useNavigate } from "react-router-dom";

function RoleLayout() {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission

    const selectedRole = event.target.role.value; // Get the selected value from the select element

    switch (selectedRole) {
      case "examinee":
        navigate("/signup");
        break; // Ensure you break out of the case
      case "examiner":
        navigate("/signupexaminer");
        break; // Ensure you break out of the case
      default:
        // Handle unexpected cases or do nothing
        break;
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="role">Select your role in Exam:</label>
        <select name="role" id="role">
          <option value="examinee">Examinee</option>
          <option value="examiner">Examiner</option>
        </select>
        <button type="submit">Continue</button>
      </form>
    </>
  );
}

export default RoleLayout;
