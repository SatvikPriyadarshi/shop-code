import { useState } from "react";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import firebaseAppconfig from "../util/firebase-config";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { IoCloseCircleOutline } from "react-icons/io5"; // Import the missing icon
import { Link , useNavigate} from "react-router-dom";

const auth = getAuth(firebaseAppconfig);

const Login = () => {
    const navigate = useNavigate()
    const [passwordType, setPasswordType] = useState("password");
    const [error, setError] = useState(null);
    const [loader,setLoader] = useState(false)
    const [formValue, setFormValue] = useState({
        email: '',
        password: ''
    });

    const login = async (e) => {
        e.preventDefault();
        try {
            setLoader(true); 
            await signInWithEmailAndPassword(auth, formValue.email, formValue.password);
            navigate("/")
        } catch (err) {
            setError("Invalid credentials provided");
        }
        finally{
            setLoader(false);  
        }
    };

    const handleChange = (e) => {
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
        <div className="grid md:grid-cols-2 md:h-screen md:overflow-hidden animate__animated__ animate__fadeIn">
            <img src="/images/signup.jpg" className="w-full md:h-full h-24 object-cover" alt="Signup" />

            <div className="flex flex-col md:p-16 p-8">
                <h1 className="text-4xl font-bold">SignIn</h1>
                <p className="text-lg text-gray-600">Enter profile details to login here</p>
                <form className="mt-8 space-y-6" onSubmit={login}>

                    <div className="flex flex-col">
                        <label className="font-semibold text-lg mb-1">EmailId</label>
                        <input
                            onChange={handleChange}
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
                            onChange={handleChange} // Added missing onChange handler
                            required
                            type={passwordType}
                            name="password"
                            placeholder="*********"
                            className="p-3 border border-gray-300 rounded"
                        />
                        <button onClick={() => setPasswordType(passwordType === "password" ? "text" : "password")} type="button" className="absolute h-8 w-8 rounded-full top-11 right-4 hover:bg-blue-200 hover:text-blue-600">
                            {
                                passwordType === "password" ? <FaEye className="ml-2" /> : <FaEyeSlash className="ml-2" />
                            }
                        </button>
                    </div>
                    {
                        loader ? 
                        <h1 className="text-lg font-semibold text-gray-500">Loading...</h1>
                        : 
                        <button className="py-3 px-8 rounded bg-blue-600 text-white font-semibold hover:bg-green-600 transition-all duration-300">Login</button>
                    }
                    
                </form>
                <div className="mt-2">
                    Don’t have an account? <Link to="/signup" className="text-blue-600 font-semibold">Register Now</Link>
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

export default Login;
