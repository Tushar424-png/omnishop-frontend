import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminOrders() {
 const BASE_URL = process.env.REACT_APP_API_URL;
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/order/getall`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  fetchOrders();
}, [token]); // Add token here since the effect depends on it

  return (
    <div className="p-4">

      <h2 className="text-2xl font-bold mb-4">
        All Orders
      </h2>

      <div className="overflow-x-auto bg-white shadow rounded-lg">

        <table className="min-w-full text-sm md:text-base">

          <thead className="bg-gray-900 text-white">
            <tr>
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">User ID</th>
              <th className="p-3 text-left">Total Amount</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Items</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.orderId}
                className="border-b hover:bg-gray-50"
              >
                <td className="p-3">{order.orderId}</td>
                <td className="p-3">{order.userId}</td>
                <td className="p-3 font-semibold">
                  ₹ {order.totalAmount}
                </td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      order.status === "SUCCESS"
                        ? "bg-green-200 text-green-800"
                        : order.status === "FAILED"
                        ? "bg-red-200 text-red-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="p-3">
                  {order.orderItem?.map((item, index) => (
                    <div key={index} className="text-xls">
                      {item.productName}
                    </div>
                  ))}
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}