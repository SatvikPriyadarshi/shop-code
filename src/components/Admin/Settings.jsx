import { useEffect, useState } from "react";
import firebaseAppconfig from "../../util/firebase-config";
import { onAuthStateChanged, getAuth, updateProfile } from "firebase/auth";
import { getStorage, } from "firebase/storage";
import Layout from "./Layout";
import { FaUserCircle } from "react-icons/fa";
import { IoSaveOutline } from "react-icons/io5";
import { FaAddressCard } from "react-icons/fa6";
import { getFirestore, collection, addDoc, getDocs, query, where, updateDoc, doc,} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { TiShoppingCart } from "react-icons/ti";
import uploadFile from "../../util/storage";

const db = getFirestore(firebaseAppconfig);
const auth = getAuth(firebaseAppconfig);
const storage = getStorage();

const Profile = () => {
    const [orders,setOrders] = useState([])
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false)
    const [docId, setDocId] = useState(null)
    const [formValue, setFormValue] = useState({
        fullname: '',
        email: '',
        mobile: '',
    });

    const [isAddress, setIsAddress] = useState(false);
    const [addressFormValue, setAddressFormValue] = useState({
        address: '',
        city: '',
        state: '',
        country: '',
        pincode: '',
        userId: '',
        moblie: '',
    });

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setSession(user);
            } else {
                setSession(false);
                navigate('/login');
            }
        });
    }, [navigate]);

    useEffect(() => {
        const req = async () => {
            if (session) {
                setFormValue({
                    ...formValue,
                    fullname: session.displayName,
                    mobile: session.phoneNumber ? session.phoneNumber : ''
                });

                setAddressFormValue({
                    ...addressFormValue,
                    userId: session.uid
                });

                // Fetching the address
                const col = collection(db, "addresses");
                const q = query(col, where("userId", "==", session.uid));
                const snapShot = await getDocs(q);

                setIsAddress(!snapShot.empty);

                snapShot.forEach((doc) => {
                    setDocId(doc.id); // Correctly set the document ID
                    const address = doc.data();
                    setAddressFormValue({
                        ...addressFormValue,
                        ...address
                    });
                });
            }
        };
        req();
    }, [session,isUpdated]);

    useEffect(()=>{

        const req= async()=>{
            if(session){
                const col = collection(db,"orders")
                const q = query(col,where("userId","==",session.uid))
                const snapshot = await getDocs(q)
                const temp = []
                snapshot.forEach((doc)=>{
                    temp.push(doc.data())
                })
                setOrders(temp)
            }
        }
        req()
    },[session])

    const setProfilePicture = async (e) => {
        const input = e.target;
        const file = input.files[0];
        if (!file) return;

        const fileNameArr = file.name.split(".");
        const ext = fileNameArr[fileNameArr.length - 1];
        const filename = Date.now() + '.' + ext;
        const path = `pictures/${filename}`;
        setUploading(true);
        try {
            const url = await uploadFile(file,path)
            await updateProfile(auth.currentUser, {
                photoURL: url,
            });
            setUploading(false);
            setSession({
                ...session, photoURL: url
            });
            console.log("uploaded")
        } catch (error) {
            console.error("Error updating profile picture:", error);
            setUploading(false);
        }
    };

    const handleFormValue = (e) => {
        const input = e.target;
        const name = input.name;
        const value = input.value;
        setFormValue({
            ...formValue,
            [name]: value
        });
    };

    const saveProfileInfo = async (e) => {
        e.preventDefault();
        await updateProfile(auth.currentUser, {
            displayName: formValue.fullname,
            phoneNumber: formValue.mobile
        });
        Swal.fire({
            icon: 'success',
            title: 'Profile Updated!'
        });
    };

    const handleAddressFormValue = (e) => {
        const input = e.target;
        const name = input.name;
        const value = input.value;
        setAddressFormValue({
            ...addressFormValue,
            [name]: value
        });
    };

    const saveAddress = async (e) => {
        try {
            e.preventDefault();
            // Add a new address and get the doc ID
            const docRef = await addDoc(collection(db, "addresses"), addressFormValue);
            setDocId(docRef.id); // Set the docId to the newly created doc
            setIsAddress(true);
            setIsUpdated(!isUpdated)
            Swal.fire({
                icon: 'success',
                title: 'Address Saved Successfully!'
            });
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Failed',
                text: err.message
            });
        }
    };

    const updateAddress = async (e) => {
        try {
            e.preventDefault();
            const ref = doc(db, "addresses", docId);
            await updateDoc(ref, addressFormValue);
            
            Swal.fire({
                icon: 'success',
                title: 'Updated Successfully!'
            });
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Failed',
                text: err.message
            });
        }
    };

    if (session === null) {
        return (
            <div className="bg-gray-100 h-full fixed top-0 left-0 w-full flex justify-center items-center">
                <span className="relative flex h-6 w-6">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-6 w-6 bg-sky-500"></span>
                </span>
            </div>
        );
    }

    return (
        <Layout>
            <div className=" bg-white mx-auto md:my-16 shadow-lg rounded-md p-8 md:w-7/12 border">
                <div className="flex gap-3">
                    <FaUserCircle className="text-4xl" />
                    <h1 className="text-3xl font-semibold">Profile</h1>
                </div>
                <hr className="my-6" />
                <div className="w-24 h-24 mx-auto relative mb-6 ">
                    {
                        uploading ? <img src="/images/loader.gif" alt="loading..." /> :
                            <img src={session.photoURL ? session.photoURL : "images/avtar.avif"} alt="profile" className="rounded-full w-24 h-24" />
                    }
                    <input
                        type="file"
                        accept="image/*"
                        className="absolute top-0 left-0 w-full h-full opacity-0"
                        onChange={setProfilePicture}
                    />
                </div>

                <form className="grid grid-cols-2 gap-6" onSubmit={saveProfileInfo}>
                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-semibold" htmlFor="fullname">Full Name</label>
                        <input
                            onChange={handleFormValue}
                            required
                            name="fullname"
                            id="fullname"
                            className="p-2 rounded border border-gray-300"
                            value={formValue.fullname}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-semibold" htmlFor="email">Email</label>
                        <input
                            onChange={handleFormValue}
                            required
                            readOnly
                            disabled
                            name="email"
                            id="email"
                            type="email"
                            className="p-2 rounded border border-gray-300"
                            value={session.email}
                        />
                    </div> 
                    <div />
                    <div className="col-span-2">
                        <button className="px-4 py-2 bg-rose-600 text-white rounded w-fit flex items-center hover:bg-green-500 transition duration-500">
                            <IoSaveOutline className="mr-2 " />
                            Save
                        </button>
                    </div>
                </form>
            </div>
            
            <div className=" bg-white mx-auto md:my-16 shadow-lg rounded-md p-8 md:w-7/12 border">
                <div className="flex gap-3">
                    <TiShoppingCart className="text-4xl" />
                    <h1 className="text-3xl font-semibold">Orders</h1>
                </div>
                <hr className="my-6" />
                {
                    orders.map((item, indx)=>(
                        <div key={indx} className="flex gap-3 mb-8">
                            <img src ={item.image} className="w-[100px]"/>
                            <div>
                                <h1 className="capitalize font-semibold text-lg">{item.title}</h1>
                                <p className="text-gray-600">{item.description.slice(0,50)}</p>
                                <div className="space-x-2 ">
                                    <label className="font-bold text-green-600 flex ">
                                        ₹{item.price - (item.price * item.discount) / 100}
                                        </label>
                                        <del className="text-gray-500">₹{item.price}</del>
                                        <label className="text-rose-600">
                                        {item.discount}% Off
                                    </label>
                                </div>
                                <button
                                className={`mt-2 rounded p-1 px-3 py-1 text-xs font-medium text-white capitalize ${
                                    item.status === "pending"
                                        ? "bg-yellow-500"
                                        : item.status === "processing"
                                        ? "bg-blue-500"
                                        : item.status === "dispatched"
                                        ? "bg-green-500"
                                        : item.status === "returned"
                                        ? "bg-red-500"
                                        : "bg-gray-400"
                                        }`}
                                        >
                                {item.status ? item.status : "pending"}
                            </button>

                            </div>
                        </div>
                    ))
                }
            </div>

            <div className=" bg-white mx-auto md:my-16 shadow-lg rounded-md p-8 md:w-7/12 border">
                <div className="flex gap-3">
                    <FaAddressCard className="text-4xl" />
                    <h1 className="text-3xl font-semibold">Delivery Address</h1>
                </div>
                <hr className="my-6" />

                <form className="grid grid-cols-2 gap-6" onSubmit={isAddress ? updateAddress : saveAddress}>
                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-semibold" htmlFor="address">Address</label>
                        <input
                            onChange={handleAddressFormValue}
                            required
                            name="address"
                            id="address"
                            className="p-2 rounded border border-gray-300"
                            value={addressFormValue.address}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-semibold" htmlFor="city">City</label>
                        <input
                            onChange={handleAddressFormValue}
                            required
                            name="city"
                            id="city"
                            className="p-2 rounded border border-gray-300"
                            value={addressFormValue.city}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-semibold" htmlFor="state">State</label>
                        <input
                            onChange={handleAddressFormValue}
                            required
                            name="state"
                            id="state"
                            className="p-2 rounded border border-gray-300"
                            value={addressFormValue.state}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-semibold" htmlFor="country">Country</label>
                        <input
                            onChange={handleAddressFormValue}
                            required
                            name="country"
                            id="country"
                            className="p-2 rounded border border-gray-300"
                            value={addressFormValue.country}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-semibold" htmlFor="pincode">Pincode</label>
                        <input
                            onChange={handleAddressFormValue}
                            required
                            name="pincode"
                            id="pincode"
                            type="number"
                            className="p-2 rounded border border-gray-300"
                            value={addressFormValue.pincode}
                        />
                    </div> 

                    <div className="flex flex-col gap-2">
                        <label className="text-lg font-semibold">Mobile</label>
                        <input
                            onChange={handleAddressFormValue}
                            required
                            name="moblie"
                            type="number"
                            className="p-2 rounded border border-gray-300"
                            value={addressFormValue.moblie}
                        />
                    </div>
                    
                    <div />

                    <div className="col-span-2">
                        <button className="px-4 py-2 bg-rose-600 text-white rounded w-fit flex items-center hover:bg-green-500 transition duration-500">
                            <IoSaveOutline className="mr-2 " />
                            {isAddress ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default Profile;
