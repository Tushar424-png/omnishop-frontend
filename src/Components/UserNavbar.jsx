import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function UserNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="bg-black text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">

        <div className="flex justify-between items-center h-16">

          <h1 className="text-xl font-bold text-yellow-400">
            E-Shop
          </h1>

          {/* Desktop */}
          <div className="hidden md:flex space-x-6 items-center">

            <Link to="/">Home</Link>

            {token && (
              <>
                <Link to="/cart">Cart</Link>
                <Link to="/wishlist">Wishlist</Link>
                <Link to="/chat">AI Chat</Link>
              </>
            )}

            {!token ? (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            ) : (
              <button
                onClick={logout}
                className="bg-yellow-400 text-black px-3 py-1 rounded"
              >
                Logout
              </button>
            )}

          </div>

          {/* Mobile Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden flex flex-col space-y-3 pb-4">

            <Link to="/">Home</Link>

            {token && (
              <>
                <Link to="/cart">Cart</Link>
                <Link to="/wishlist">Wishlist</Link>
                <Link to="/chat">AI Chat</Link>
              </>
            )}

            {!token ? (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            ) : (
              <button
                onClick={logout}
                className="bg-yellow-400 text-black px-3 py-1 rounded w-fit"
              >
                Logout
              </button>
            )}

          </div>
        )}

      </div>
    </nav>
  );
}
