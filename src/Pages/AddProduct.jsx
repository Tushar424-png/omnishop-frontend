import { useState } from "react";
import axios from "axios";

export default function AddProduct() {
  const BASE_URL = process.env.REACT_APP_API_URL;
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    active: true
  });

  const [image, setImage] = useState(null);
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append(
      "product",
      JSON.stringify(form)
    );
    formData.append("image", image);

    try {
      await axios.post(
        `${BASE_URL}/products/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert("Product Added");
      setForm({ name: "", description: "", price: "", category: "", active: true });
      setImage(null);
      
      // Input file field ko reset karne ke liye (native method)
      e.target.reset();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg p-6 rounded w-full max-w-lg"
      >
        <h2 className="text-xl font-bold mb-4">Add Product</h2>

        <input
          type="text"
          placeholder="Name"
          className="w-full border p-2 mb-2"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <textarea
          placeholder="Description"
          className="w-full border p-2 mb-2"
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Price"
          className="w-full border p-2 mb-2"
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Category"
          className="w-full border p-2 mb-2"
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        />

        <input
          type="file"
          className="mb-3"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button className="w-full bg-blue-600 text-white p-2 rounded">
          Add Product
        </button>
      </form>
    </div>
  );
}