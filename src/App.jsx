import styles from "./App.module.css";
import Layout from "./components/Layout.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NewUser from "./components/NewUser.jsx";
import Home from "./components/Home.jsx";
import UserDashboard from "./components/UserDashboard.jsx";
import Login from "./components/Login.jsx";
import NewExaminer from "./components/NewExaminer.jsx";
import RoleLayout from "./components/RoleLayout.jsx";
import ProctorDashboard from "./components/ProctorDashboard.jsx";
import AddExam from "./components/AddExam.jsx";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rolelayout" element={<RoleLayout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/signup" element={<NewUser />} />
          <Route path="/signupexaminer" element={<NewExaminer />} />
          <Route path="/proctordashboard" element={<ProctorDashboard />} />
          <Route path="/addexam" element={<AddExam />} />
        </Routes>
      </Layout>
    </Router>
  );
}
export default App;
