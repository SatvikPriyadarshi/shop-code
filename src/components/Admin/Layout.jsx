import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineLogout } from "react-icons/ai";
import { BiSolidDashboard } from "react-icons/bi";
import { IoMenu } from "react-icons/io5";
import { PiShoppingCartThin } from "react-icons/pi";
import { FaMoneyCheck } from "react-icons/fa";
import { FaUsersLine } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { GoListOrdered } from "react-icons/go";
import firebaseAppConfig from "../../util/firebase-config";
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

const auth = getAuth(firebaseAppConfig);

const Layout = ({ children }) => {
  const [size, setSize] = useState(280);
  const [mobileSize, setMobileSize] = useState(0);
  const [accountMenu, setAccountMenu] = useState(false);
  const location = useLocation();
  const [session, setSession] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setSession(user);
      } else {
        setSession(null);
      }
    });
    return () => unsubscribe(); // Clean up the subscription on unmount
  }, []);

  const menus = [
    { label: 'Dashboard', icon: <BiSolidDashboard className="mr-2" />, link: '/admin/dashboard' },
    { label: 'Products', icon: <PiShoppingCartThin className="mr-2" />, link: '/admin/products' },
    { label: 'Customers', icon: <FaUsersLine className="mr-2" />, link: '/admin/customers' },
    { label: 'Orders', icon: <GoListOrdered className="mr-2" />, link: '/admin/orders' },
    { label: 'Payments', icon: <FaMoneyCheck className="mr-2" />, link: '/admin/payments' },
    { label: 'Settings', icon: <IoSettingsOutline className="mr-2" />, link: '/admin/settings' },
  ];

  return (
    <>
      {/* Desktop */}
      <div className="md:block hidden">
        <aside 
          className="bg-gray-800 fixed top-0 left-0 h-full overflow-hidden"
          style={{
            width: size,
            transition: '0.3s'
          }}
        >
          <div className="flex flex-col">
            {
              menus.map((item, index) => (
                <Link 
                  key={index} 
                  to={item.link} 
                  className="px-4 py-3 text-gray-50 text-[17.5px] hover:bg-indigo-500 hover:text-white flex items-center"
                  style={{
                    background: (location.pathname === item.link) ? '#6366F1' : 'transparent'
                  }}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))
            }
            <button
              onClick={() => signOut(auth)}
              className="text-left px-4 py-3 text-gray-50 text-[17.5px] hover:bg-indigo-500 hover:text-white flex items-center"
            >
              <AiOutlineLogout className="mr-2" />
              Logout
            </button>
          </div>
        </aside>

        <section
          className="bg-gray-100 min-h-screen"
          style={{
            marginLeft: size,
            transition: '0.3s'
          }}
        >
          <nav className="bg-white p-6 shadow flex items-center justify-between sticky top-0 left-0">
            <div className="flex gap-4 items-center">
              <button
                className="bg-gray-50 hover:bg-indigo-600 hover:text-white w-8 h-8"
                onClick={() => setSize(size === 280 ? 0 : 280)}
              >
                <IoMenu className="text-xl" />
              </button>
              <h1 className="text-md font-semibold">Shopcode</h1>
            </div>

            <div>
              <button className="relative">
                <img
                  src={session?.photoURL || "/images/avt.avif"} // Use session photoURL or default image
                  className="w-10 h-10 rounded-full"
                  onClick={() => setAccountMenu(!accountMenu)}
                  alt="Profile"
                />
                {accountMenu &&
                  <div className="absolute top-18 right-0 bg-white w-[250px] p-4 shadow-lg rounded-lg">
                    <div>
                      <h1 className="text-lg font-semibold">{session?.displayName || 'Admin'}</h1>
                      <p className="text-gray-500">{session?.email || 'example@gmail.com'}</p>
                      <div className="h-px bg-gray-200 my-4" />
                      <button 
                        onClick={() => signOut(auth)}
                        className="flex items-center text-red-600 hover:text-red-800"
                      >
                        <AiOutlineLogout className="mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                }
              </button>
            </div>
          </nav>
          <div className="p-6">
            {children}
          </div>
        </section>
      </div>

      {/* Mobile */}
      <div className="md:hidden block">
        <aside 
          className="bg-gray-800 fixed top-0 left-0 h-full z-50 overflow-hidden"
          style={{
            width: mobileSize,
            transition: '0.3s'
          }}
        >
          <div className="flex flex-col">
            <button
              className="text-left mx-4 mt-4"
              onClick={() => setMobileSize(mobileSize === 0 ? 280 : 0)}
            >
              <IoMenu className="text-white text-xl" />
            </button>
            {
              menus.map((item, index) => (
                <Link 
                  key={index} 
                  to={item.link} 
                  className="px-4 py-3 text-gray-50 text-[17.5px] hover:bg-indigo-500 hover:text-white flex items-center"
                  style={{
                    background: (location.pathname === item.link) ? '#6366F1' : 'transparent'
                  }}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))
            }
            <button
              onClick={() => signOut(auth)}
              className="text-left px-4 py-3 text-gray-50 text-[17.5px] hover:bg-indigo-500 hover:text-white flex items-center"
            >
              <AiOutlineLogout className="mr-2" />
              Logout
            </button>
          </div>
        </aside>

        <section className="bg-gray-100 h-screen">
          <nav className="bg-white p-6 shadow flex items-center justify-between sticky top-0 left-0">
            <div className="flex gap-4 items-center">
              <button
                className="bg-gray-50 hover:bg-indigo-600 hover:text-white w-8 h-8"
                onClick={() => setMobileSize(mobileSize === 0 ? 280 : 0)}
              >
                <IoMenu className="text-xl" />
              </button>
              <h1 className="text-md font-semibold">Shopcode</h1>
            </div>

            <div>
              <button className="relative">
                <img
                  src={session?.photoURL || "/images/avt.avif"} // Use session photoURL or default image
                  className="w-10 h-10 rounded-full"
                  onClick={() => setAccountMenu(!accountMenu)}
                  alt="Profile"
                />
                {accountMenu &&
                  <div className="absolute top-18 right-0 bg-white w-[250px] p-4 shadow-lg rounded-lg">
                    <div>
                      <h1 className="text-lg font-semibold">{session?.displayName || 'Admin'}</h1>
                      <p className="text-gray-500">{session?.email || 'example@gmail.com'}</p>
                      <div className="h-px bg-gray-200 my-4" />
                      <button 
                        onClick={() => signOut(auth)}
                        className="flex items-center text-red-600 hover:text-red-800"
                      >
                        <AiOutlineLogout className="mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                }
              </button>
            </div>
          </nav>
          <div className="p-6">
            {children}
          </div>
        </section>
      </div>
    </>
  );
};

export default Layout;
