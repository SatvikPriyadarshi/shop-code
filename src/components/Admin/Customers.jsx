import { useState, useEffect } from "react";
import Layout from "./Layout";
import firebaseAppConfig from "../../util/firebase-config";
import { getFirestore, getDocs, collection } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import moment from "moment";

const db = getFirestore(firebaseAppConfig);
const storage = getStorage(firebaseAppConfig);

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const snapshot = await getDocs(collection(db, "customers"));
                const tmp = [];

                for (const doc of snapshot.docs) {
                    const document = doc.data();
                    if (document.avatar) {
                      
                        const avatarRef = ref(storage, document.avatar);
                        document.avatarURL = await getDownloadURL(avatarRef);
                    } else {
                        document.avatarURL = '/default-avatar.png'; 
                    }
                    tmp.push(document);
                }
                setCustomers(tmp);
            } catch (err) {
                console.error("Error fetching customers:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    if (loading) {
        return <Layout><p>Loading...</p></Layout>;
    }

    if (error) {
        return <Layout><p>Error: {error}</p></Layout>;
    }

    return (
        <Layout>
            <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Customers</h1>
                <div className="overflow-x-auto shadow-lg rounded-lg">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-700 text-white">
                                <th className="px-6 py-3 text-left text-sm font-medium">Customer's Name</th>
                                <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
                                <th className="px-6 py-3 text-left text-sm font-medium">Mobile</th>
                                <th className="px-6 py-3 text-left text-sm font-medium">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.length > 0 ? (
                                customers.map((item, index) => (
                                    <tr
                                        key={index}
                                        className={`text-left ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100`}
                                    >
                                        <td className="px-6 py-4 flex items-center">
                                            <img
                                                src={item.avatarURL} 
                                                className="w-12 h-12 rounded-full mr-4"
                                                alt={`${item.customerName}'s avatar`}
                                            />
                                            <div>
                                                <h2 className="font-semibold text-gray-800 capitalize">{item.customerName}</h2>
                                                <p className="text-sm text-gray-500">
                                                    {moment(item.createdAt?.toDate()).format('DD MMM YYYY, hh:mm:ss A')}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{item.email}</td>
                                        <td className="px-6 py-4">{item.mobile}</td>
                                        <td className="px-6 py-4">{moment(item.createdAt?.toDate()).format('DD MMM YYYY, hh:mm:ss A')}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-4 text-gray-500">
                                        No customers found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};

export default Customers;
