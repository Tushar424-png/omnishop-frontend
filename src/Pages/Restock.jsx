import { useState } from "react";
import axios from "axios";

export default function Restock() {

  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        "http://localhost:8080/Inventory/Restock",
        {
          productId: Number(productId),
          quantity: Number(quantity)
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert("Restocked Successfully");
      setProductId("");
      setQuantity("");

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded p-6 w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4">Restock Product</h2>

        <input
          type="number"
          placeholder="Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="w-full border p-2 mb-3"
          required
        />

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full border p-2 mb-3"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded"
        >
          Restock
        </button>
      </form>
    </div>
  );
}