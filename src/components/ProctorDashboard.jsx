import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import styles from "./Proctor.module.css"; // Import the CSS module
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "./Table";

function ProctorDashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const response = await axios.get(
          "http://localhost:3000/api/user-data",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div className={styles.loader}>
        <p>Loading...</p>
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
      <Table className={styles.tableContainer} data={userData} />{" "}
      {/* Apply styles to Table */}
    </div>
  );
}

export default ProctorDashboard;
