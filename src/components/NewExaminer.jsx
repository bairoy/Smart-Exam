import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import styles from "./NewExaminer.module.css"; // Import the CSS module

function NewExaminer() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employee_id: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    school: "",
  });
  const [otpInput, setOtpInput] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
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
        "http://localhost:3000/api/proctorverify-otp",
        {
          email: formData.email,
          otp: otpInput,
          name: formData.name,
          phone: formData.phone,
          password: formData.password,
          employee_id: formData.employee_id,
          school: formData.school,
        }
      );
      if (response.data.success) {
        navigate("/proctordashboard");
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
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <label htmlFor="employee_id">Employee ID:</label>
        <input
          type="text"
          id="employee_id"
          name="employee_id"
          value={formData.employee_id}
          onChange={handleChange}
        />
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
          type="text"
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
        <label htmlFor="school">School:</label>
        <input
          type="text"
          id="school"
          name="school"
          value={formData.school}
          onChange={handleChange}
        />
        <button type="submit">{isOtpSent ? "Verify OTP" : "Send OTP"}</button>
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
            required
          />
          <button type="submit">Verify OTP</button>

          {error && <p className={styles.error}>{error}</p>}
          {successMessage && <p className={styles.success}>{successMessage}</p>}
        </form>
      )}
    </div>
  );
}

export default NewExaminer;
