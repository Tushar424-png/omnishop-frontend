import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { listenForegroundMessages } from "./notificationService";

import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Cart from "./Pages/Cart";
import Wishlist from "./Pages/Wishlist";
import { Chatboat } from "./Pages/Chatboat";

import AdminOrders from "./Pages/AdminOrders";
import AdminInventory from "./Pages/AdminInventory";
import AddProduct from "./Pages/AddProduct";
import Restock from "./Pages/Restock";

import UserNavbar from "./Components/UserNavbar";
import AdminNavbar from "./Components/AdminNavbar";

function App() {

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // 🔥 ADD THIS
  useEffect(() => {
    listenForegroundMessages();
  }, []);

  // 🔐 Protected Route Component
  const ProtectedRoute = ({ children, allowedRole }) => {
    if (!token) {
      return <Navigate to="/login" />;
    }

    if (allowedRole && role !== allowedRole) {
      return <Navigate to="/" />;
    }

    return children;
  };

  return (
    <BrowserRouter>

      {role === "ADMIN" ? <AdminNavbar /> : <UserNavbar />}

      <Routes>

        <Route 
          path="/" 
          element={
            role === "ADMIN"
              ? <Navigate to="/admin/dashboard" />
              : <Home />
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<Chatboat />} />

        {/* USER ROUTES */}
        <Route 
          path="/cart" 
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/wishlist" 
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />

        {/* ADMIN ROUTES */}
        <Route 
          path="/admin/orders" 
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminOrders />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminInventory />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/admin/add-product" 
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AddProduct />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/admin/restock" 
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <Restock />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;