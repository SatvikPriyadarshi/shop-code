import { useState, useEffect } from "react";
import Layout from "./Layout";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import firebaseAppconfig from "../util/firebase-config";
import { getFirestore, addDoc, collection, getDocs,serverTimestamp,query,where } from "firebase/firestore";
import "swiper/css";
import Swal from "sweetalert2";
import "swiper/css/navigation";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import "swiper/css/pagination";
import { FaCartPlus } from "react-icons/fa";
import axios from "axios";
import useRazorPay from "react-razorpay";
import { useNavigate } from "react-router-dom";

const db = getFirestore(firebaseAppconfig);
const auth = getAuth(firebaseAppconfig);

const Home = ({slider,title="Latest Products"}) => {
  const navigate = useNavigate()
  const [Razorpay] = useRazorPay();
  const [products, setProducts] = useState([]);
  const [session, setSession] = useState(null);

  const [address, setAddress] = useState(null)


  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setSession(user);
      } else {
        setSession(null);
      }
    });
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "products"));
        const temp = [];
        snapshot.forEach((doc) => {
          const allProducts = doc.data();
          allProducts.id = doc.id;
          temp.push(allProducts);
        });
        setProducts(temp);
      } catch (err) {
        console.error("Error fetching products:", err.message);
      }
    };
    fetchProducts();
  }, []);

    useEffect(()=>{
      const req = async()=>{
        if(session){
            const col = collection(db,"addresses")
            const q = query(col , where("userId" , "==" , session.uid ))
            const snapshot = await getDocs(q); 
            snapshot.forEach((doc)=>{
                const document = doc.data()
                setAddress(document)
            })
        }
      }
      req()
    },[session])

    console.log(address )

  const addToCart = async (item) => {
    if (!session) {
      Swal.fire({
        icon: "error",
        title: "Not Logged In",
        text: "Please log in to add items to your cart.",
      });
      return;
    }

    try {
      item.userId = session.uid;
      await addDoc(collection(db, "carts"), item);
      Swal.fire({
        icon: "success",
        title: "Product Added to Cart",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err.message,
      });
    }
  };

  const buyNow = async (product) => {
    try {

      if (!address) {
        Swal.fire({
          icon: "info",
          title: "Address Not Found",
          text: "Please fill in your address before proceeding with the payment.",
        });
        navigate('/profile')
        return ;
      }
  
      product.userId = session.uid;
      product.status = "pending";
      const amount = (product.price - (product.price * product.discount) / 100);
      
    
      const { data } = await axios.post("http://localhost:8080/order", { amount: amount });
  
      
      const options = {
        key: "rzp_test_K6mkJM55cYybxF", 
        amount: data.amount,
        order_id: data.orderId,
        name: 'You & Me Shop',
        description: product.title,
        image: 'https://img.freepik.com/premium-photo/flash-logo-black-background_893012-211210.jpg',
        handler: async function(response) {
          
          product.email = session.email;
          product.customerName = session.displayName;
          product.address = address;
          product.createdAt = serverTimestamp();
          await addDoc(collection(db, "orders"), product);
  
          
          navigate('/profile');
          
        
          Swal.fire({
            icon: "success",
            title: "Payment Successful",
            text: `Payment ID: ${response.razorpay_payment_id}`,
          });
        },
        notes: {
          name: session.displayName,
        },
        prefill: {
          name: session ? session.displayName : "Guest",
          email: session ? session.email : "guest@example.com",
        },
        theme: {
          color: "#3399cc",
        },
      };  

      const rzp = new Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", function(response) {
        console.error("Payment failed:", response.error);
        Swal.fire({
          icon: "error",
          title: "Payment Failed",
          text: response.error.description,
        });
      });
    } catch (err) {
      console.error("Error during payment:", err.message);
      Swal.fire({
        icon: "error",
        title: "Payment Error",
        text: err.message,
      });
    }
  };

  return (
    <Layout>
      <div>
        {
          slider && 
          <header>
          <Swiper
            className="transition duration-1000"
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            pagination={true}
            navigation={true}
            modules={[Autoplay, Navigation, Pagination]}
            slidesPerView={1}
          >
            <SwiperSlide>
              <img src="/images/p1.jpg" alt="Slide 1" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="/images/p2.jpg" alt="Slide 2" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="/images/p3.jpg" alt="Slide 3" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="/images/p4.jpg" alt="Slide 4" />
            </SwiperSlide>
            <SwiperSlide>
              <img src="/images/p5.jpg" alt="Slide 5" />
            </SwiperSlide>
          </Swiper>
          </header>
        }
        

        <div className="md:p-16 p-8">
          <h1 className="text-3xl font-bold text-center">{title}</h1>
          <p className="mx-auto text-center text-gray-600 md:w-7/12 mt-2 mb-16">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fuga
            magnam laudantium accusantium omnis.
          </p>
          <div className="md:w-10/12 mx-auto md:grid grid-cols-4 gap-8">
            {products.map((item, indx) => (
              <div key={indx} className="bg-white shadow-lg mb-2 border">
                <div className="w-full h-64 overflow-hidden">
                  <img
                    src={item.image ? item.image : '/images/products.png'}
                    alt={item.title}
                    className="object-cover w-full h-full capitalize"
                  />
                </div>
                <div className="p-4">
                <h1 className="text-lg font-semibold">
                  {item.title.charAt(0).toUpperCase() + item.title.slice(1)}
                </h1>
                  <div className="flex gap-1">
                    <label className="font-bold text-green-600">
                      ₹{item.price - (item.price * item.discount) / 100}
                    </label>
                    <del className="text-gray-500">₹{item.price}</del>
                    <label className="text-green-600">
                      {item.discount}% Off
                    </label>
                  </div>
                  <button
                    className="rounded bg-green-500 py-2 w-full text-white font-semibold mt-4 hover:bg-green-700 transition duration-300 ease-in-out"
                    onClick={() => buyNow(item)}
                  >
                    Buy Now
                  </button>
                  <button
                    className="flex items-center justify-center rounded bg-rose-500 py-2 mt-2 w-full h-[39px] text-white font-semibold hover:bg-red-700 transition duration-300 ease-in-out"
                    onClick={() => addToCart(item)}
                  >
                    <FaCartPlus className="mr-2" />
                    Add To Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
