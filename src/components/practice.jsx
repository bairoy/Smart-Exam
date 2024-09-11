// NewUser.jsx
import React, { useState } from "react";
import axios from "axios"; // Import axios for making HTTP requests
import style from "./NewUser.module.css";

function NewUser() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send user data to backend to generate OTP
    try {
      const response = await axios.post("/api/send-otp", formData);
      setOtp(response.data.otp); // Store OTP if needed
      setIsOtpSent(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    // Verify OTP
    try {
      await axios.post("/api/verify-otp", {
        email: formData.email,
        otp: otpInput,
      });
      // Redirect to user dashboard or show success message
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  return (
    <div className={style.newUser}>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <label htmlFor="phone">Phone:</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />

        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <input type="submit" value="Send OTP" />
      </form>

      {isOtpSent && (
        <form onSubmit={handleOtpSubmit}>
          <label htmlFor="otp">Enter OTP:</label>
          <input
            type="text"
            id="otp"
            name="otp"
            value={otpInput}
            onChange={(e) => setOtpInput(e.target.value)}
          />
          <input type="submit" value="Verify OTP" />
        </form>
      )}
    </div>
  );
}

export default NewUser;
