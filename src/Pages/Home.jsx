import { useEffect, useState } from "react";
import ProductCard from "../Components/ProductCard";

export default function Home() {

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetch("http://localhost:8080/products/getall")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.log(err));
  }, []);

  // ✅ Get Unique Categories
  const categories = ["All", ...new Set(products.map(p => p.category))];

  // ✅ Filter Logic
  const filteredProducts = products.filter(product => {

    // Search Filter (startsWith)
    const matchesSearch =
      search.trim() === "" ||
      product.name.toLowerCase().startsWith(search.toLowerCase());

    // Category Filter
    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto p-4">

      <h1 className="text-3xl font-bold mb-6">
        Latest Products
      </h1>

      {/* 🔍 Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full sm:w-1/3"
        />

        {/* 📂 Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border p-2 rounded w-full sm:w-1/4"
        >
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>

      </div>

      {/* 🛍 Products Grid */}
      {filteredProducts.length === 0 ? (
        <p className="text-gray-500">No products found...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

    </div>
  );
}