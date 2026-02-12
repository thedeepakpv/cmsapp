import { Routes, Route } from "react-router-dom";
import StartPage from "./pages/Startpage";
import UserHome from "./pages/Userhome";
import AdminHome from "./pages/Adminhome";
import Profile from "./pages/Profile";
import Updatemenu from "./pages/Updatemenu";
import { useState } from "react";

function App() {

  const [menuItems, setMenuItems] = useState([
    { id: 1, name: "Chocolate Bar", price: 20, available: true },
    { id: 2, name: "Candy Pop", price: 15, available: false }
  ]);


  return (
    <Routes>
      <Route path="/" element={<StartPage />} />
      <Route path="/user" element={<UserHome menuItems={menuItems}/>} />
      <Route path="/admin" element={<AdminHome />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/updatemenu" element={
        <Updatemenu
          menuItems={ menuItems }
          setMenuItems={ setMenuItems }
        />}
      />
    </Routes>
  );
}

export default App;
