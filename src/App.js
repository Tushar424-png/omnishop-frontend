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
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    listenForegroundMessages();
    
    // Ek chota sa delay check taaki localStorage sync ho jaye
    const checkAuth = () => {
      setIsVerifying(false);
    };
    
    checkAuth();
  }, [token]); // Token change hone par re-run hoga

  // 🔐 Protected Route Component (UPDATED LOGIC)
  const ProtectedRoute = ({ children, allowedRole }) => {
    const currentToken = localStorage.getItem("token");
    const currentRole = localStorage.getItem("role");

    // 1. Agar abhi state verify ho rahi hai, toh loading dikhao
    if (isVerifying) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-yellow-400"></div>
          <p className="mt-4 text-gray-600 font-medium">Authenticating...</p>
        </div>
      );
    }

    // 2. Agar verifying khatam ho gayi aur phir bhi token nahi mila, tab login bhejo
    if (!currentToken) {
      return <Navigate to="/login" replace />;
    }

    // 3. Role check
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
