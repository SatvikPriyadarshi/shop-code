import { useState, useEffect } from "react";
import Layout from "./Layout";
import axios from "axios";
import moment from "moment";

const Payments = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const req = async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/payments");
        setPayments(data.items);
      } catch (err) {
        console.log(err);
      }
    };
    req();
  }, []);

  return (
    <Layout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold text-gray-800">Payments</h1>
        <div className="mt-6 bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-700 text-gray-200 text-sm uppercase tracking-wider">
                <th className="py-4 px-6">Payment Id</th>
                <th className="py-4 px-6">Customer's Name</th>
                <th className="py-4 px-6">Email</th>
                <th className="py-4 px-6">Mobile</th>
                <th className="py-4 px-6">Product</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((item, index) => (
                <tr
                  className={`text-gray-700 text-sm ${
                    (index + 1) % 2 === 0 ? "bg-gray-100" : "bg-white"
                  }`}
                  key={index}
                >
                  <td className="py-4 px-6 font-medium">{item.id}</td>
                  <td className="py-4 px-6 capitalize">
                    {item.notes.name ? item.notes.name : "John Doe"}
                  </td>
                  <td className="py-4 px-6">{item.email}</td>
                  <td className="py-4 px-6">{item.contact}</td>
                  <td className="py-4 px-6 capitalize">{item.description}</td>
                  <td className="py-4 px-6 font-semibold text-green-600">
                    ₹{item.amount.toLocaleString()}
                  </td>
                  <td className="py-4 px-6">
                    {moment.unix(item.created_at).format("DD MMM YYYY, hh:mm:ss A")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Payments;
