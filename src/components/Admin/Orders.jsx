import { useState, useEffect } from "react";
import Layout from "./Layout";
import firebaseAppConfig from '../../util/firebase-config';
import { getFirestore, getDocs, collection, updateDoc, doc, } from "firebase/firestore";
import Swal from "sweetalert2";
import moment from "moment";

const db = getFirestore(firebaseAppConfig);

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [toggleAddress, setToggleAddress] = useState(false);
    const [toggleIndex, setToggleIndex] = useState(null);
    const [sliderColor, setSliderColor] = useState('white'); 
    const [updateUi, setUpdateUi] = useState(false); 

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'orders'));
                const ordersList = snapshot.docs.map(doc => ({
                    ...doc.data(),
                    orderId: doc.id
                }));
                setOrders(ordersList);
            } catch (err) {
                console.error("Error fetching orders:", err.message);
            }
        };
        fetchOrders();
    }, [updateUi]);

    const updateOrderStatus = async (e, orderId) => {
        try {
            const status = e.target.value;
            const ref = doc(db, "orders", orderId);
            await updateDoc(ref, { status });
            Swal.fire({
                icon: 'success',
                title: 'Order Status Updated!'
            });
            setUpdateUi(!updateUi)
        } catch (err) {
            console.error("Error updating order status:", err.message);
        }
    };

    return (
        <Layout>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Orders</h1>
                <div className="mt-6 mb-6">
                    <label htmlFor="color-slider" className="block text-sm font-medium text-gray-700">Select Status Color for fun:</label>
                    <input
                        id="color-slider"
                        type="color"
                        className="mt-1 block w-16 h-10 border rounded-md"
                        value={sliderColor}
                        onChange={(e) => setSliderColor(e.target.value)}
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Customer Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Mobile</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Address</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map((item, index) => (
                                <tr key={item.orderId} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.orderId}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 capitalize">{item.customerName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{item.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {item.address && item.address.moblie ? item.address.moblie : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 capitalize">{item.title}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">₹{item.price.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {moment(item.createdAt.toDate()).format('DD MMM YYYY, hh:mm:ss A')}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        <button
                                            className="text-blue-600 font-medium"
                                            onClick={() => {
                                                setToggleIndex(index);
                                                setToggleAddress(!toggleAddress);
                                            }}
                                        >
                                            Browse Address
                                        </button>
                                        {toggleAddress && toggleIndex === index && (
                                            <div className="mt-2">
                                                {item.address
                                                  ? `${item.address.address}, ${item.address.city}, ${item.address.state}, ${item.address.country}, ${item.address.pincode}, Mob-${item.address.moblie}`
                                                  : 'Address not available'}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        <select 
                                            className="border border-gray-300 rounded-md p-2 bg-gray-50"
                                            onChange={(e) => updateOrderStatus(e, item.orderId)}
                                            value={item.status}
                                            style={{ backgroundColor: sliderColor }}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="dispatched">Dispatched</option>
                                            <option value="returned">Returned</option>
                                        </select>
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

export default Orders;
