import axiosInstance from "../Utils/AxiosInstance";

export default function ProductCard({ product }) {

  if (!product?.active) return null;

  // ================= CART =================
  const handleAddCart = async () => {

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
      alert("Please login first");
      return;
    }

    const alreadyInCart = user.cartItems?.some(
      item => item.productId === product.id
    );

    if (alreadyInCart) {
      alert("Product already in cart");
      return;
    }

    try {

      await axiosInstance.post("/Cart/add", {
        userId: user.id,
        productId: product.id,
        quantity: 1
      });

      // ⭐ Fresh user fetch
      const updatedUser = await axiosInstance.get(`/user/getone/${user.id}`);

      localStorage.setItem("user", JSON.stringify(updatedUser.data));

      alert("Added To Cart");

    } catch (err) {

      if (err.response?.status === 401) {
        alert("Please login first");
      } else {
        alert("Error adding to cart");
      }
    }
  };

  // ================= WISHLIST =================

  const handleAddWishlist = async () => {

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {
      alert("Please login first");
      return;
    }

    const alreadyWishlist = user.wishlistItems?.some(
      item => item.productId === product.id
    );

    if (alreadyWishlist) {
      alert("Already in wishlist");
      return;
    }

    try {

      await axiosInstance.post("/wishlist/add", {
        userId: user.id,
        productId: product.id
      });

      const updatedUser = await axiosInstance.get(`/user/getone/${user.id}`);
      localStorage.setItem("user", JSON.stringify(updatedUser.data));

      alert("Added To Wishlist");

    } catch (err) {

      if (err.response?.status === 401) {
        alert("Please login first");
      } else {
        alert("Error adding wishlist");
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition">

      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-48 object-cover rounded-t-2xl"
      />

      <div className="p-4">

        <h2 className="font-semibold text-lg">{product.name}</h2>

        <p className="text-gray-500 text-sm line-clamp-2">
          {product.description}
        </p>

        <div className="flex justify-between mt-3">
          <span className="font-bold text-green-600">
            ₹{product.price}
          </span>

          <span className="text-xs bg-yellow-200 px-2 py-1 rounded">
            {product.category}
          </span>
        </div>

        <div className="flex gap-2 mt-4">

          <button
            onClick={handleAddCart}
            className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800"
          >
            Add To Cart
          </button>

          <button
            onClick={handleAddWishlist}
            className="flex-1 bg-yellow-400 text-black py-2 rounded-lg hover:bg-yellow-500"
          >
            Wishlist
          </button>

        </div>

      </div>
    </div>
  );
}
