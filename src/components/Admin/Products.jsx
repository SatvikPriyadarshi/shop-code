import { useState, useEffect } from "react";
import Layout from "./Layout";
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoIosCloseCircle } from "react-icons/io";
import firebaseAppconfig from "../../util/firebase-config";
import uploadFile from "../../util/storage";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { getFirestore, addDoc, collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import Swal from "sweetalert2";

const db = getFirestore(firebaseAppconfig);

const Products = () => {
    const [products, setProducts] = useState([]);
    const [triggerUpdate, setTriggerUpdate] = useState(false);
    const [productForm, setProductForm] = useState({
        title: '',
        description: '',
        price: '',
        discount: ''
    });
    const [productModal, setProductModal] = useState(false);
    const [applyCloseAnimation, setApplyCloseAnimation] = useState(false);
    const [edit, setEdit] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            const snapshot = await getDocs(collection(db, "products"));
            const temp = [];
            snapshot.forEach((doc) => {
                const productData = doc.data();
                productData.id = doc.id;
                temp.push(productData);
            });
            setProducts(temp);
        };
        fetchProducts();
    }, [triggerUpdate]);

    const handleModalClose = () => {
        setApplyCloseAnimation(true);
        setTimeout(() => {
            setProductModal(false);
        }, 500); 
    };

    const handleOpenModal = () => {
        setApplyCloseAnimation(false);
        setProductModal(true);
        setProductForm({
            title: '',
            description: '',
            price: '',
            discount: ''
        });
        setEdit(null);
    };

    const handleProductForm = (e) => {
        const { name, value } = e.target;
        setProductForm({
            ...productForm,
            [name]: value
        });
    };

    const saveProduct = async (e) => {
        e.preventDefault();
        try {
            if (edit) {
                const ref = doc(db, "products", edit.id);
                await updateDoc(ref, productForm);
                Swal.fire({
                    icon: 'success',
                    title: 'Product Updated',
                });
            } else {
                await addDoc(collection(db, "products"), productForm);
                Swal.fire({
                    icon: 'success',
                    title: 'Product Added',
                });
            }
            setTriggerUpdate(!triggerUpdate);
            handleModalClose();
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Failed',
                text: err.message
            });
        }
    };

    const uploadProductImage = async (e, id) => {
        const file = e.target.files[0];
        if (file) {
            const path = `products/${Date.now()}.png`;
            const url = await uploadFile(file, path);
            const ref = doc(db, "products", id);
            await updateDoc(ref, { image: url });
            setTriggerUpdate(!triggerUpdate);
        }
    };

    const deleteProduct = async (id) => {
        try {
            const ref = doc(db, "products", id);
            await deleteDoc(ref);
            setTriggerUpdate(!triggerUpdate);
            Swal.fire({
                icon: 'success',
                title: "Item Deleted Successfully!"
            });
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: "Failed",
                text: err.message
            });
        }
    };

    const editProduct = (item) => {
        setProductForm({ ...item });
        setEdit(item);
        setApplyCloseAnimation(false);
        setProductModal(true);  // Move the modal open logic here after setting state
    };

    return (
        <Layout>
            <div>
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-semibold mb-4">Products</h1>
                    <button className="bg-indigo-600 text-white rounded py-2 px-4 flex items-center" onClick={handleOpenModal}>
                        <IoMdAddCircleOutline className="mr-2 text-xl" />
                        New Product
                    </button>
                </div>

                <div className="grid md:grid-cols-4 gap-8 mt-8">
                    {products.map((item, index) => (
                        <div key={index} className="bg-white rounded-md shadow-lg">
                            <div className="relative">
                                <img
                                    src={item.image ? item.image : "/images/product.webp"}
                                    className="rounded-t-md w-full h-[270px] object-cover"
                                    alt={item.title}
                                />
                                <input
                                    type="file"
                                    className="opacity-0 w-full h-full absolute top-0 left-0"
                                    onChange={(e) => uploadProductImage(e, item.id)}
                                />
                            </div>
                            <div className="p-4">
                                <div className="flex items-center justify-between">
                                    <h1 className="font-semibold text-lg capitalize">{item.title}</h1>
                                    <div className="flex gap-2">
                                        <button onClick={() => deleteProduct(item.id)}>
                                            <MdDelete className="text-2xl text-red-600" />
                                        </button>
                                        <button onClick={() => editProduct(item)}>
                                            <CiEdit className="text-2xl text-green-500" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-1 items-center">
                                    <label className="text-green-600 font-semibold">₹{item.price - (item.price * item.discount) / 100}</label>
                                    <del className="text-gray-500 font-semibold">₹{item.price}</del>
                                    <label className="text-red-600">({item.discount}% Off)</label>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {productModal && (
                    <div className={`bg-black bg-opacity-80 fixed top-0 left-0 w-full h-full flex justify-center items-center animate__animated ${applyCloseAnimation ? 'animate__fadeOut' : 'animate__fadeIn'}`}>
                        <div className={`animate__animated ${applyCloseAnimation ? 'animate__zoomOut' : 'animate__zoomIn'} animate__faster bg-white w-6/12 py-5 px-6 rounded-md border relative`}>
                            <button className="absolute top-2 right-2" onClick={handleModalClose}>
                                <IoIosCloseCircle className="text-lg hover:text-red-600" />
                            </button>
                            <h1 className="text-lg font-semibold">{edit ? "Edit Product" : "New Product"}</h1>
                            <form className="grid grid-cols-2 gap-6 mt-4" onSubmit={saveProduct}>
                                <input
                                    required
                                    name="title"
                                    type="text"
                                    placeholder="Enter Product Title Here"
                                    className="p-2 border border-gray-300 rounded col-span-2"
                                    onChange={handleProductForm}
                                    value={productForm.title}
                                />
                                <input
                                    required
                                    type="number"
                                    name="price"
                                    placeholder="Price"
                                    className="p-2 border border-gray-300 rounded"
                                    onChange={handleProductForm}
                                    value={productForm.price}
                                />
                                <input
                                    required
                                    type="number"
                                    name="discount"
                                    placeholder="Discount"
                                    className="p-2 border border-gray-300 rounded"
                                    onChange={handleProductForm}
                                    value={productForm.discount}
                                />
                                <textarea
                                    required
                                    name="description"
                                    placeholder="Description"
                                    className="p-2 border border-gray-300 rounded col-span-2"
                                    rows={7}
                                    onChange={handleProductForm}
                                    value={productForm.description}
                                />
                                <div>
                                    <button className="bg-indigo-600 text-white rounded px-4 py-2">Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Products;
