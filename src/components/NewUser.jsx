import React, { useState } from "react";
import style from "./NewUser.module.css"; // Import the CSS module
import axios from "axios";
import { useNavigate } from "react-router-dom";

function NewUser() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    classnumber: "",
    school: "",
  });
  const [otpInput, setOtpInput] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState(""); // State for error messages
  const [successMessage, setSuccessMessage] = useState(""); // State for success messages

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(""); // Clear error message on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/send-otp", {
        email: formData.email,
      });
      if (response.data.success) {
        setIsOtpSent(true);
        setSuccessMessage("OTP sent successfully. Please check your email.");
      } else {
        setError("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setError("An error occurred while sending OTP. Please try again later.");
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/api/verify-otp",
        {
          email: formData.email,
          otp: otpInput,
          name: formData.name,
          phone: formData.phone,
          password: formData.password,
          classnumber: formData.classnumber,
          school: formData.school,
        }
      );
      if (response.data.success) {
        navigate("/dashboard");
      } else {
        setError(
          "OTP verification failed. Please check your OTP and try again."
        );
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError(
        "An error occurred while verifying OTP. Please try again later."
      );
    }
  };

  return (
    <div className={style.outsideDiv}>
      <form className={style.newUser} onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="phone">Phone:</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <label htmlFor="classnumber">Class Number:</label>
        <input
          type="text"
          id="classnumber"
          name="classnumber"
          value={formData.classnumber}
          onChange={handleChange}
        />

        <label htmlFor="school">School (write in short form):</label>
        <input
          type="text"
          id="school"
          name="school"
          value={formData.school}
          onChange={handleChange}
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit" className={style.btnclass}>
          Send OTP
        </button>

        {error && <p className={style.error}>{error}</p>}
        {successMessage && <p className={style.success}>{successMessage}</p>}
      </form>

      {isOtpSent && (
        <form onSubmit={handleOtpSubmit} className={style.otpForm}>
          <label htmlFor="otp">Enter OTP:</label>
          <input
            type="text"
            id="otp"
            name="otp"
            value={otpInput}
            onChange={(e) => setOtpInput(e.target.value)}
            required
          />
          <button type="submit" className={style.btnclass}>
            Verify OTP
          </button>

          {error && <p className={style.error}>{error}</p>}
        </form>
      )}
    </div>
  );
}

export default NewUser;
