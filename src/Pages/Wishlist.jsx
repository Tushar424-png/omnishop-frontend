import { useEffect, useState } from "react";
import axiosInstance from "../Utils/AxiosInstance";

export default function WishlistPage() {

  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  // ---------------- LOAD WISHLIST WITH PRODUCT DATA ----------------
  const loadWishlist = async () => {
    try {
      if (!userId) return;

      const userData = localStorage.getItem("user");
      if (!userData) return;

      const user = JSON.parse(userData);
      const localWishlist = user.wishlistItems || [];

      if (localWishlist.length === 0) {
        setWishlistItems([]);
        return;
      }

      const updatedWishlist = await Promise.all(
        localWishlist.map(async (item) => {
          try {
            const res = await axiosInstance.get(
              `/products/getone/${item.productId}`
            );
            const product = res.data;

            return {
              productId: item.productId,
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

      setWishlistItems(updatedWishlist.filter(Boolean));

    } catch (e) {
      console.error("Error loading wishlist", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------- REMOVE FROM WISHLIST ----------------
  const removeFromWishlist = async (productId) => {
    try {
      await axiosInstance.delete(`/wishlist/remove/${userId}/${productId}`);

      const updatedUser = JSON.parse(localStorage.getItem("user"));

      updatedUser.wishlistItems =
        updatedUser.wishlistItems.filter(item => item.productId !== productId);

      localStorage.setItem("user", JSON.stringify(updatedUser));

      loadWishlist();

    } catch (e) {
      alert("Error removing item");
    }
  };

  // ---------------- TOTAL CALC ----------------
  const totalAmount = wishlistItems.reduce((acc, item) => {
    return acc + item.price;
  }, 0);

  if (loading) return <p className="p-6">Loading wishlist...</p>;

  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">

      {/* LEFT → WISHLIST ITEMS */}
      <div className="lg:col-span-2 space-y-6">

        <h1 className="text-3xl font-bold">Your Wishlist</h1>

        {wishlistItems.length === 0 ? (
          <p className="text-gray-500">Your wishlist is empty</p>
        ) : (
          wishlistItems.map(item => (
            <div key={item.productId} className="flex gap-4 bg-white p-4 rounded-2xl shadow">

              <img
                src={item.imageUrl}
                alt={item.productName}
                className="w-32 h-32 object-cover rounded-xl"
              />

              <div className="flex-1">
                <h2 className="font-semibold text-lg">{item.productName}</h2>
                <p className="font-bold text-green-600 mt-2">₹{item.price}</p>

                <button
                  onClick={() => removeFromWishlist(item.productId)}
                  className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Remove
                </button>
              </div>

            </div>
          ))
        )}

      </div>

      {/* RIGHT → SUMMARY CARD */}
      <div className="h-fit sticky top-6">

        <div className="bg-white shadow-xl rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-bold">Wishlist Summary</h2>

          <div className="flex justify-between">
            <span>Total Items</span>
            <span>{wishlistItems.length}</span>
          </div>

          <div className="flex justify-between font-semibold text-lg">
            <span>Total Value</span>
            <span>₹{totalAmount.toFixed(2)}</span>
          </div>
        </div>

      </div>

    </div>
  );
}
