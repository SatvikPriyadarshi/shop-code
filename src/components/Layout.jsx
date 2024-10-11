import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import firebaseAppConfig from '../util/firebase-config';
import { CgProfile } from "react-icons/cg";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { FaCartPlus } from "react-icons/fa6";
import { AiOutlineLogout } from "react-icons/ai";
import { IoMenuSharp } from "react-icons/io5";
import { collection ,query, where, getDocs,getFirestore } from "firebase/firestore";
import { CiShoppingCart } from "react-icons/ci";
import { RiAdminFill } from "react-icons/ri";


const db = getFirestore(firebaseAppConfig)

const auth = getAuth(firebaseAppConfig);

const Layout = ({children}) => {
    const [open, setOpen] = useState(false);
    const [accountMenu, setAccountMenu] = useState(false);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true); 
    const[cartCount,setCartCount] = useState(0)
    const[role, setRole] = useState(null)
    const [updateUi, setUpdateUi] = useState(false) 
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setSession(user);
            } else {
                setSession(null);
            }
            setLoading(false); 
        });

        return () => unsubscribe(); // Clean up the subscription
    }, []);


    useEffect(()=>{
        if(session){
            const req = async()=>{
                const col = collection(db,"carts")
                const q = query(col, where("userId","==" , session.uid))
                 const snapshot = await getDocs(q)
                 setCartCount(snapshot.size)
                 setUpdateUi(!updateUi)
            }
            req()
        }
    },[session,updateUi])


    useEffect(()=>{
        if(session){
            const req = async()=>{
                const col = collection(db,"customers")
                const q = query(col, where("userId","==" , session.uid))
                 const snapshot = await getDocs(q)
                 setCartCount(snapshot.size)
                 setUpdateUi(!updateUi)
                 snapshot.forEach((doc)=>{
                    const customer = doc.data()
                    setRole(customer.role)
                 })
            }
            req()
        }
    },[session])
 


    const menus = [
        { label: "Home", href: '/' },
        { label: "Products", href: '/products' },
        { label: "Category", href: '/category' },
        { label: "Contact us", href: '/contact-us' }
    ];

    const mobileLink = (href) => {
        navigate(href);
        setOpen(false);
    };

    if (loading) {
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
        <div>
            <nav className="sticky top-0 left-0 shadow-lg bg-white z-50">
                <div className="md:w-10/12 mx-auto flex items-center justify-between">
                    <img 
                        src="/images/logo.png"
                        className="w-[100px]"
                        alt="Logo"
                    />
                    
                    <button className="md:hidden" onClick={() => setOpen(!open)}>
                        <IoMenuSharp className="text-2xl hover:bg-gray-300 hover:transition duration-500"/>
                    </button>

                    <ul className="md:flex gap-6 items-center hidden">
                        {menus.map((item, index) => (
                            <li key={index}>
                                <Link 
                                    to={item.href}
                                    className="block py-3 text-center hover:bg-teal-500 hover:text-white transition duration-300  w-[100px] rounded"
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                        {
                           (session && cartCount > 0) &&
                           <Link to="/cart" className="relative flex items-center">
                               <div className="relative">
                                   <CiShoppingCart 
                                       className={`text-xl h-8 w-8 ${cartCount > 0 && cartCount< 5? 'text-red-600' : 'text-green-600'}`} 
                                   />
                                   <div className="absolute -top-2 -right-2 flex justify-center items-center bg-red-600 text-xs font-bold text-white h-5 w-5 rounded-full">
                                       {cartCount}
                                   </div>
                               </div>
                           </Link>
                       
                        }
                        {!session && (
                            <>
                                <Link to="/cart" className="relative ">
                                    <CiShoppingCart className="text-2xl h-6 w-6 text-gray-700  hover:bg-teal-200 transition duration-500 " />
                                    {cartCount > 0 && (
                                        <div className="absolute -top-2 -right-2 font-semibold h-5 w-5 text-white text-xs bg-rose-600 rounded">
                                            {cartCount}
                                        </div>
                                    )}
                                </Link>


                                <Link 
                                    className="bg-teal-600 py-3 px-10 text-md font-semibold text-white block text-center hover:bg-rose-600 hover:text-white transition-all duration-300 rounded"
                                    to="/signup"
                                >
                                    Signup
                                </Link>
                            </>
                        )}

                        {session && (
                            <button onClick={() => setAccountMenu(!accountMenu)}>
                                <img src={session.photoURL ? session.photoURL :"/images/avtar.avif"} className="w-10 h-10 rounded-full" alt="User Avatar" />
                                <div
                                    className={`w-[150px] py-3 bg-teal-100 absolute top-12 right-0 shadow-lg shadow-gray-200 rounded-lg transition-all duration-500 ease-in-out transform flex flex-col items-center gap-1 ${
                                        accountMenu ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                                    }`}
                                    style={{ pointerEvents: accountMenu ? 'auto' : 'none' }}
                                >
                                    {
                                        (role && role === "admin") && 
                                        <Link
                                        to="/admin/dashboard"
                                        className="flex items-center w-full px-2 py-2 text-gray-700 hover:bg-teal-200 transition duration-500 rounded-md"
                                        >
                                        <RiAdminFill className="mr-2" />
                                        <span>Admin Pannel</span>
                                        </Link>
                                    }
                                    <Link
                                        to="/profile"
                                        className="flex items-center w-full px-2 py-2 text-gray-700 hover:bg-teal-200 transition duration-500 rounded-md"
                                    >
                                        <CgProfile className="mr-2" />
                                        <span>My Profile</span>
                                    </Link>

                                    <Link
                                        to="/cart"
                                        className="flex items-center w-full px-2 py-2 text-gray-700 hover:bg-teal-200 transition duration-500 rounded-md"
                                    >
                                        <FaCartPlus className="mr-2" />
                                        <span>Cart</span>
                                    </Link>

                                    <button
                                        className="flex items-center w-full px-2 py-2 text-gray-700 hover:bg-rose-500 transition duration-1000 rounded-md"
                                        onClick={async () => {
                                            try {
                                                await signOut(auth);
                                                navigate('/login');
                                            } catch (error) {
                                                console.error('Sign-out error:', error);
                                            }
                                        }}
                                    >
                                        <AiOutlineLogout className="mr-2" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </button>
                        )}

                    </ul>
                </div>
            </nav>
            
            <div>
                {children}
            </div>
            <footer className="bg-orange-600 py-16">
                <div className="w-10/12 mx-auto grid md:grid-cols-4 md:gap-0 gap-8">
                    <div>
                        <h1 className="text-white font-semibold text-2xl mb-3">Website Links</h1>
                        <ul className="space-y-2 text-slate-50">
                            {menus.map((item, index) => (
                                <li key={index}>
                                    <Link to={item.href}>{item.label}</Link>
                                </li>
                            ))}
                            <li><Link to="/login">Login</Link></li>
                            <li><Link to="/signup">Signup</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h1 className="text-white font-semibold text-2xl mb-3">Follow us</h1>
                        <ul className="space-y-2 text-slate-50">
                            <li><Link to="/">Facebook</Link></li>
                            <li><Link to="/">Youtube</Link></li>
                            <li><Link to="/">Twitter</Link></li>
                            <li><Link to="/">Linkedin</Link></li>
                            <li><Link to="/">Instagram</Link></li>
                        </ul>
                    </div>
                    <div className="pr-8">
                        <h1 className="text-white font-semibold text-2xl mb-3">Brand Details</h1>
                        <p className="text-slate-50 mb-6">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad saepe cupidium est velit excepturi sit corrupti tempora officia recusandae!</p>
                        <img 
                            src="/images/logo.png"
                            className="w-[100px]"
                            alt="Brand Logo"
                        />
                    </div>
                    <div>
                        <h1 className="text-white font-semibold text-2xl mb-3">Contact us</h1>
                        <form className="space-y-4">
                            <input 
                                required
                                name="fullname"
                                className="bg-white w-full rounded p-3"
                                placeholder="Your name"
                            />

                            <input 
                                required
                                type="email"
                                name="email"
                                className="bg-white w-full rounded p-3"
                                placeholder="Enter email id"
                            />

                            <textarea 
                                required
                                name="message"
                                className="bg-white w-full rounded p-3"
                                placeholder="Message"
                                rows={3}
                            />

                            <button className="bg-black text-white py-3 px-6 rounded">Submit</button>
                        </form>
                    </div>
                </div>
            </footer>




        <aside 
            className={`overflow-hidden md:hidden bg-slate-900 shadow-lg fixed top-0 left-0 h-full z-50 mt-16 transition-all duration-300 ${open ? 'w-[250px]' : 'w-0'}`}
        >
            {session && (
                <div className="relative flex flex-col items-center gap-2 py-4">
                    <button className="relative" onClick={() => setAccountMenu(!accountMenu)}>
                        <img src={session.photoURL ? session.photoURL :"/images/avtar.avif"} className="w-12 h-12 rounded-full" alt="User Avatar" />
                    </button>
                    <span className="text-white text-sm">{session.displayName}</span>
                    <span className="text-gray-400 text-xs">{session.email}</span> 
                    <div
                        className={`w-[150px] py-3 bg-teal-100 absolute top-16 right-0 shadow-lg shadow-gray-200 rounded-lg transition-all duration-500 ease-in-out transform ${
                            accountMenu ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-5'
                        }`}
                        style={{ pointerEvents: accountMenu ? 'auto' : 'none' }}
                    >
                        <Link
                            to="/profile"
                            className="flex items-center w-full px-2 py-2 text-gray-700 hover:bg-teal-200 transition duration-500 rounded-md"
                        >
                            <CgProfile className="mr-2" />
                            <span>My Profile</span>
                        </Link>

                        <Link
                            to="/cart"
                            className="flex items-center w-full px-2 py-2 text-gray-700 hover:bg-teal-200 transition duration-500 rounded-md"
                        >
                            <FaCartPlus className="mr-2" />
                            <span>Cart</span>
                        </Link>

                        <button
                            className="flex items-center w-full px-2 py-2 text-gray-700 hover:bg-rose-500 transition duration-1000 rounded-md"
                            onClick={async () => {
                                try {
                                    await signOut(auth);
                                    navigate('/login'); 
                                } catch (error) {
                                    console.error('Sign-out error:', error);
                                }
                            }}
                        >
                            <AiOutlineLogout className="mr-2" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            )}
            <div className={`flex flex-col p-8 gap-4 py-3 transition-all duration-300 ${accountMenu ? 'translate-y-20' : 'translate-y-0'}`}>
                {menus.map((item, index) => (
                    <button 
                        onClick={() => mobileLink(item.href)} 
                        key={index} 
                        className="text-white hover:bg-indigo-300 rounded p-1"
                    >
                        {item.label}
                    </button>
                ))}
                {
                        (session && cartCount > 0) &&
                            <Link  to="/cart" className=" p-8 gap-4 py-3 relative text-white flex ml-6 mr-10 hover:bg-indigo-300 rounded ">  Cart
                                <div className="absolute font-bold -top-3 right-2 text-rose-500 mt-6">{cartCount}</div>
                            </Link>
                        }
                
                <button className="text-white hover:bg-rose-500 rounded mb-1 transition duration-500 py-1" onClick={() =>setOpen(false)}>
                    Close
                </button>
            </div>
        </aside>




        </div>
    );
};

export default Layout;
