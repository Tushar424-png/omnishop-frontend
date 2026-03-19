import { useEffect, useState } from "react";
import axiosInstance from "../Utils/AxiosInstance";

export default function CartPage() {

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  // ---------------- LOAD CART WITH PRODUCT DATA ----------------
  const loadCartFromLocal = async () => {
    try {
      const userData = localStorage.getItem("user");

      if (!userData) return;

      const user = JSON.parse(userData);
      const localCart = user.cartItems || [];

      if (localCart.length === 0) {
        setCartItems([]);
        return;
      }

      const updatedCart = await Promise.all(
        localCart.map(async (item) => {
          try {
            const res = await axiosInstance.get(
              `/products/getone/${item.productId}`
            );

            const product = res.data;

            return {
              productId: item.productId,
              quantity: item.quantity,
              productName: product.name,
              price: product.price,
              imageUrl: product.imageUrl
            };
          } catch (err) {
            console.error("Product fetch failed", err);
            return null;
          }
        })
      );

      setCartItems(updatedCart.filter(Boolean));

    } catch (e) {
      console.error("Error loading cart", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCartFromLocal();
  }, []);

  // ---------------- REMOVE FROM CART ----------------
  const removeFromCart = async (productId) => {
    try {
      await axiosInstance.delete(`/Cart/remove/${userId}/${productId}`);

      const updatedUser = JSON.parse(localStorage.getItem("user"));

      updatedUser.cartItems =
        updatedUser.cartItems.filter(item => item.productId !== productId);

      localStorage.setItem("user", JSON.stringify(updatedUser));

      loadCartFromLocal();

    } catch (e) {
      alert("Error removing item");
    }
  };

  // ---------------- TOTAL CALC ----------------
  const totalAmount = cartItems.reduce((acc, item) => {
    return acc + (item.price * item.quantity);
  }, 0);

  // ---------------- RAZORPAY SCRIPT LOADER ----------------
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // ---------------- PLACE ORDER FLOW ----------------
  const handlePlaceOrder = async () => {

    if (!userId) {
      alert("Please login first");
      return;
    }

    setPlacingOrder(true);

    try {

      // ✅ STEP 1 — STOCK CHECK
      const checkRes = await axiosInstance.post(`/order/check/${userId}`);
      const stockResponse = checkRes.data;

      if (!stockResponse.success || stockResponse.status === "STOCK_FAILED") {

        const errors = stockResponse.data || [];

        if (errors.length > 0) {
          alert(
            "Stock Issue:\n" +
            errors.map(e =>
              `Product ${e.productId} → ${e.reason} (Available: ${e.availableQuantity})`
            ).join("\n")
          );
        } else {
          alert(stockResponse.message || "Stock validation failed");
        }

        setPlacingOrder(false);
        return;
      }

      // ✅ STEP 2 — LOAD RAZORPAY
      const razorLoaded = await loadRazorpay();

      if (!razorLoaded) {
        alert("Razorpay SDK failed to load");
        setPlacingOrder(false);
        return;
      }

      // ✅ STEP 3 — OPEN PAYMENT
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY,
        amount: Math.round(totalAmount * 100),
        currency: "INR",
        name: "Your Ecommerce",
        description: "Order Payment",

        handler: async function () {
          try {

            // ✅ STEP 4 — CREATE ORDER
            await axiosInstance.post(`/order/create/${userId}`);

            // ✅ STEP 5 — CLEAR LOCAL STORAGE CART
            const storedUser = localStorage.getItem("user");

            if (storedUser) {
              const updatedUser = JSON.parse(storedUser);
              updatedUser.cartItems = [];
              localStorage.setItem("user", JSON.stringify(updatedUser));
            }

            // ✅ STEP 6 — CLEAR UI CART
            setCartItems([]);

            alert("Order Placed Successfully 🎉");

          } catch (e) {
            alert("Order creation failed after payment");
          }
        },

        prefill: {
          email: "test@example.com",
          contact: "9999999999",
        },

        theme: {
          color: "#000000"
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (e) {
      console.error(e);
      alert("Order failed");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) return <p className="p-6">Loading cart...</p>;

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">

      {/* LEFT → CART ITEMS */}
      <div className="lg:col-span-2 space-y-6">

        <h1 className="text-3xl font-bold">Your Cart</h1>

        {cartItems.length === 0 ? (
          <p className="text-gray-500">Cart is empty</p>
        ) : (
          cartItems.map(item => (
            <div key={item.productId} className="flex gap-4 bg-white p-4 rounded-2xl shadow">

              <img
                src={item.imageUrl}
                alt={item.productName}
                className="w-32 h-32 object-cover rounded-xl"
              />

              <div className="flex-1">
                <h2 className="font-semibold text-lg">{item.productName}</h2>
                <p className="text-gray-500">Qty: {item.quantity}</p>
                <p className="font-bold text-green-600 mt-2">₹{item.price}</p>

                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Remove
                </button>
              </div>

            </div>
          ))
        )}

      </div>

      {/* RIGHT → ORDER CARD */}
      <div className="h-fit sticky top-6">

        <div className="bg-white shadow-xl rounded-2xl p-6 space-y-4">

          <h2 className="text-xl font-bold">Order Summary</h2>

          <div className="flex justify-between">
            <span>Total Items</span>
            <span>{cartItems.length}</span>
          </div>

          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>₹{totalAmount.toFixed(2)}</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={placingOrder || cartItems.length === 0}
            className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 disabled:opacity-50"
          >
            {placingOrder ? "Processing..." : "Place Order"}
          </button>

        </div>

      </div>

    </div>
  );
}
