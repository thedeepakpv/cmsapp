import { Routes, Route } from "react-router-dom";
import StartPage from "./pages/Startpage";
import UserHome from "./pages/Userhome";
import AdminHome from "./pages/Adminhome";
import Profile from "./pages/Profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path="/user" element={<UserHome />} />
      <Route path="/admin" element={<AdminHome />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;
