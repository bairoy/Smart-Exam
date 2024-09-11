import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import styles from "./UserDashboard.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "./Table";

function UserDashboard() {
  const [userData, setUserData] = useState(null); // State for storing user data
  const [loading, setLoading] = useState(true); // State for tracking loading status
  const navigate = useNavigate(); // Hook for programmatic navigation

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token from local storage
        if (!token) {
          navigate("/login"); // Redirect to login if no token
          return;
        }
        const response = await axios.get(
          "http://localhost:3000/api/user-data", // API endpoint for user data
          {
            headers: {
              Authorization: `Bearer ${token}`, // Set authorization header with token
            },
          }
        );
        setUserData(response.data); // Store user data in state
      } catch (error) {
        console.error("error fetching user data", error);
        navigate("/login"); // Redirect to login on error
      } finally {
        setLoading(false); // Update loading state
      }
    };
    fetchUserData();
  }, [navigate]); // Dependency array includes navigate to avoid re-fetching

  if (loading) {
    return <p>Loading....</p>; // Display loading message while fetching data
  }
  if (!userData) {
    return <p>No user data found</p>; // Display message if no user data is found
  }

  return (
    <Table></Table>
    // <div>
    //   <h1>Welcome, {userData.name}</h1>
    //   <p>Email: {userData.email}</p>
    //   <p>Phone: {userData.phone}</p>

    // </div>
  );
}

export default UserDashboard;
