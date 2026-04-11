import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
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
  const [isVerifying, setIsVerifying] = useState(true);
  const role = localStorage.getItem("role");

  useEffect(() => {
    listenForegroundMessages();
    
    // Netlify/Production environment mein storage sync ke liye delay zaroori hai
    const timer = setTimeout(() => {
      setIsVerifying(false);
    }, 800); // 800ms ka buffer taaki token settle ho jaye

    return () => clearTimeout(timer);
  }, []);

  // 🔐 Protected Route Component (NETLIFY OPTIMIZED)
  const ProtectedRoute = ({ children, allowedRole }) => {
    const token = localStorage.getItem("token");
    const currentRole = localStorage.getItem("role");

    // Jab tak check chal raha hai, tab tak sirf loading dikhao
    if (isVerifying) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 font-medium">Checking session...</p>
        </div>
      );
    }

    // Ab agar token nahi mila, toh hi login pe bhejo
    if (!token) {
      return <Navigate to="/login" replace />;
    }

    // Role validation
    if (allowedRole && currentRole !== allowedRole) {
      return <Navigate to="/" replace />;
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

        {/* Fallback for 404/Unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
