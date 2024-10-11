import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import firebaseAppconfig from "../util/firebase-config";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {getFirestore, addDoc, collection, serverTimestamp} from 'firebase/firestore'
import { IoCloseCircleOutline } from "react-icons/io5";

const auth = getAuth(firebaseAppconfig);
const db = getFirestore();

const Signup = () => {
    const navigate = useNavigate();
    const [passwordType, setPasswordType] = useState("password");
    const [error, setError] = useState(null);
    const [loader, setLoader] = useState(false);

    const [formValue, setFormValue] = useState({
        fullname: '',
        mobile: '',
        email: '',
        password: '',
    });

    const signup = async (e) => {
        e.preventDefault();
        setLoader(true);
        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, formValue.email, formValue.password);
            const user = userCredential.user;

            // Update the user's profile with the display name
            await updateProfile(user, {
                displayName: formValue.fullname
            });

            await addDoc(collection(db,"customers"),{
                email: formValue.email,
                customerName: formValue.fullname,
                userId: userCredential.user.uid,
                mobile : formValue.mobile,
                role:'user',
                createdAt: serverTimestamp()
            })

            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoader(false);
        }
    };

    const handleOnchange = (e) => {
        const input = e.target;
        const name = input.name;
        const value = input.value;
        setFormValue({
            ...formValue,
            [name]: value
        });
        setError(null);
    };

    return (
        <div className="grid md:grid-cols-2 md:h-screen animate__animated animate__fadeIn">
            <img src="/images/signup.jpg" className="w-full md:h-full h-24 object-cover" alt="Signup" />

            <div className="flex flex-col md:p-16 p-8">
                <h1 className="text-4xl font-bold">New User</h1>
                <p className="text-lg text-gray-600">Create your account to start shopping</p>
                <form className="mt-8 space-y-6" onSubmit={signup}>
                    <div className="flex flex-col">
                        <label className="font-semibold text-lg mb-1">Full Name</label>
                        <input
                            onChange={handleOnchange}
                            required
                            name="fullname"
                            placeholder="Er Satvik"
                            className="p-3 border border-gray-300 rounded"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-semibold text-lg mb-1">Moblie</label>
                        <input
                            onChange={handleOnchange}
                            required
                            type="number"
                            name="mobile"
                            placeholder="Enter your 10 digit ph-no.com"
                            className="p-3 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold text-lg mb-1">Email</label>
                        <input
                            onChange={handleOnchange}
                            required
                            type="email"
                            name="email"
                            placeholder="example@gmail.com"
                            className="p-3 border border-gray-300 rounded"
                        />
                    </div>

                    <div className="flex flex-col relative">
                        <label className="font-semibold text-lg mb-1">Password</label>
                        <input
                            onChange={handleOnchange}
                            required
                            type={passwordType}
                            name="password"
                            placeholder="*********"
                            className="p-3 border border-gray-300 rounded"
                        />
                        <button
                            onClick={() => setPasswordType(passwordType === "password" ? "text" : "password")}
                            type="button"
                            className="absolute h-8 w-8 rounded-full top-11 right-4 hover:bg-blue-200 hover:text-blue-600"
                        >
                            {passwordType === "password" ? <FaEye className="ml-2" /> : <FaEyeSlash className="ml-2" />}
                        </button>
                    </div>
                    {
                        loader ?
                            <h1 className="text-lg font-semibold text-gray-600">Loading...</h1>
                            :
                            <button className="py-3 px-8 rounded bg-blue-600 text-white font-semibold hover:bg-green-600 transition-all duration-300">Sign Up</button>
                    }
                </form>
                <div className="mt-2">
                    Already have an account? <Link to="/login" className="text-blue-600 font-semibold">Sign in Now</Link>
                </div>

                {
                    error &&
                    <div className="mt-2 bg-rose-600 p-3 rounded shadow text-white font-semibold animate__animated animate__pulse flex justify-between items-center">
                        <p>{error}</p>
                        <button onClick={() => setError(null)}>
                            <IoCloseCircleOutline className="text-2xl" />
                        </button>
                    </div>
                }
            </div>
        </div>
    );
};

export default Signup;
