import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">

        <div className="flex justify-between items-center h-16">

          <h1 className="text-xl font-bold text-red-400">
            Admin Panel
          </h1>

          {/* Desktop */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/admin/dashboard">Dashboard</Link>
            <Link to="/admin/add-product">Add Product</Link>
            <Link to="/admin/orders">Orders</Link>
            <Link to="/admin/restock">Restock</Link>

            <button
              onClick={logout}
              className="bg-red-400 text-black px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden flex flex-col space-y-3 pb-4">
            <Link to="/admin/dashboard">Dashboard</Link>
            <Link to="/admin/add-product">Add Product</Link>
            <Link to="/admin/inventory">Inventory</Link>
            <Link to="/admin/orders">Orders</Link>

            <button
              onClick={logout}
              className="bg-red-400 text-black px-3 py-1 rounded w-fit"
            >
              Logout
            </button>
          </div>
        )}

      </div>
    </nav>
  );
}
