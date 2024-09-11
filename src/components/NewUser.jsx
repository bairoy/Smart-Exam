import React, { useState } from "react";
import style from "./NewUser.module.css"; // Import the CSS module
import axios from "axios";

function NewUser() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/send-otp", {
        email: formData.email,
      });
      if (response.data.success) {
        setIsOtpSent(true);
      } else {
        alert("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("An error occurred while sending OTP. Please try again later.");
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
          role: formData.role,
        }
      );
      if (response.data.success) {
        window.location.href = "/dashboard";
      } else {
        alert("OTP verification failed. Please check your OTP and try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("An error occurred while verifying OTP. Please try again later.");
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
        <label htmlFor="role">role:</label>
        <input
          type="text"
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
        />

        <button type="submit" className={style.btnclass}>
          Send OTP
        </button>
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
        </form>
      )}
    </div>
  );
}

export default NewUser;
