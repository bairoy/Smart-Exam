import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./Proctor.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "./Table.jsx"; // Make sure this is the correct path

function ProctorDashboard() {
  const [userData, setUserData] = useState(null);
  const [examData, setExamData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const userResponse = await axios.get(
        "http://localhost:3000/api/proctor-data",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserData(userResponse.data);

      const examResponse = await axios.get(
        "http://localhost:3000/api/exam-data",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Extract data array from the response
      setExamData(examResponse.data.data || []);
      console.log(examResponse.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data");
      navigate("/login"); // Navigate on error if necessary
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className={styles.loader}>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
      </div>
    );
  }

  if (!userData) {
    return <p>No user data found</p>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <h1>Welcome, {userData.name}</h1>
      <p>Email: {userData.email}</p>
      <p>Phone: {userData.phone}</p>

      <button
        className={styles.addExamButton}
        onClick={() => navigate("/addexam")}
      >
        Add Exam
      </button>

      <div>
        <h2>Exam List</h2>
        {/* Render the Table component */}
        <Table data={examData} />
      </div>
    </div>
  );
}

export default ProctorDashboard;
