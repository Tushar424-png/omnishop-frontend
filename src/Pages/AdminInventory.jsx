import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminInventory() {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Define the function INSIDE the effect to satisfy the dependency rules
    const fetchInventory = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/Inventory/getall",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setData(res.data);
      } catch (err) {
        console.error("Error fetching inventory:", err);
      }
    };

    fetchInventory();
  }, [token]); // Adding token as a dependency is safer if it ever changes

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Inventory</h2>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full border text-sm md:text-base">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">ProductId</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.productId} className="border-b hover:bg-gray-50 transition-colors">
                
                <td className="p-3">{item.productName}</td>
                <td className="p-3">{item.productId || item.ProductId}</td>
                <td className="p-3 font-mono">{item.quantity}</td>
                <td className="p-3">
                  {item.quantity > 0 ? (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold uppercase">
                      In Stock
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold uppercase">
                      Out Of Stock
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}