import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import StartPage from "./pages/Startpage";
import UserHome from "./pages/Userhome";
import AdminHome from "./pages/Adminhome";
import Profile from "./pages/Profile";
import Updatemenu from "./pages/Updatemenu";
import Cartpage from "./pages/Cartpage";
import QRScanner from "./pages/QRScanner";
import MyOrders from "./pages/MyOrders";
import Analytics from "./pages/Analytics";
import { useAuth } from "./context/AuthContext";

function ProtectedRoute({ children, role }) {
  const { currentUser, loading } = useAuth();
  if (loading) return null;
  if (!currentUser) return <Navigate to="/" replace />;
  if (role && currentUser.role !== role) return <Navigate to="/" replace />;
  return children;
}

function App() {
  const [cartItems, setCartItems] = useState([]);

  return (
    <Routes>
      <Route path="/" element={<StartPage />} />

      <Route
        path="/user"
        element={
          <ProtectedRoute role="user">
            <UserHome cartItems={cartItems} setCartItems={setCartItems} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/cart"
        element={
          <ProtectedRoute role="user">
            <Cartpage cartItems={cartItems} setCartItems={setCartItems} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminHome />
          </ProtectedRoute>
        }
      />

      <Route
        path="/updatemenu"
        element={
          <ProtectedRoute role="admin">
            <Updatemenu />
          </ProtectedRoute>
        }
      />

      <Route
        path="/orders"
        element={
          <ProtectedRoute role="user">
            <MyOrders />
          </ProtectedRoute>
        }
      />

      <Route
        path="/scanner"
        element={
          <ProtectedRoute role="admin">
            <QRScanner />
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedRoute role="admin">
            <Analytics />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
