import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddExam = () => {
  const [formData, setFormData] = useState({
    examName: "",
    examDate: "",
    startTime: "",
    endTime: "",
    examLink: "",
    school: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/api/submitexam",
        formData
      );

      if (response.data.success) {
        setSuccessMessage("Exam added successfully!");
        setFormData({
          examName: "",
          examDate: "",
          startTime: "",
          endTime: "",
          examLink: "",
          school: "",
        });
        setError("");
        // Pass a callback to refresh the data and navigate back
        setTimeout(
          () =>
            navigate("/proctordashboard", { state: { refreshExamData: true } }),
          1500
        );
      } else {
        setError("Failed to add exam. Please try again.");
      }
    } catch (error) {
      console.error("Error adding exam:", error);
      setError(
        "An error occurred while adding the exam. Please try again later."
      );
    }
  };

  return (
    <div>
      <h1>Add a New Exam</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="examName">Name of Examination:</label>
          <input
            type="text"
            id="examName"
            name="examName"
            onChange={handleChange}
            value={formData.examName}
            required
          />
        </div>
        <div>
          <label htmlFor="examDate">Date:</label>
          <input
            type="date"
            id="examDate"
            name="examDate"
            onChange={handleChange}
            value={formData.examDate}
            required
          />
        </div>
        <div>
          <label htmlFor="startTime">Start Time:</label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            onChange={handleChange}
            value={formData.startTime}
            required
          />
        </div>
        <div>
          <label htmlFor="endTime">End Time:</label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            onChange={handleChange}
            value={formData.endTime}
            required
          />
        </div>
        <div>
          <label htmlFor="examLink">Exam Link:</label>
          <input
            type="url"
            name="examLink"
            id="examLink"
            value={formData.examLink}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="school">School:</label>
          <input
            type="text"
            name="school"
            id="school"
            value={formData.school}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </div>
  );
};

export default AddExam;
