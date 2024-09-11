import styles from "./App.module.css";
import Layout from "./components/Layout.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NewUser from "./components/NewUser.jsx";
import Home from "./components/Home.jsx";
import UserDashboard from "./components/UserDashboard.jsx";
import Login from "./components/Login.jsx";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<NewUser />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<UserDashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}
export default App;
