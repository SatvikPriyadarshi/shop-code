import { useState } from "react";
import Layout from "./Layout";
import { TbCategoryPlus } from "react-icons/tb";

const Category = () =>{
    const[category,setCategory] = useState([
        {
            title: "electronics",
        },
        {
            title: "Fashion",
        },
        {
            title: "Mens",
        },
        {
            title: "Boys",
        },
        {
            title: "Womens",
        },
        {
            title: "Make-Up",
        },
        {
            title: "Deos",
        },
        {
            title: "Clothes",
        },
    ])
    return (
        <Layout>
            <div className="md:p-16 p-8">
              <div className="md:w-10/12 p-16 mx-auto grid md:grid-cols-4 md:gap-16 gap-8">
                {
                    category.map((item, indx) => (
                        <div key={indx} className="hover:bg-orange-500 hover:text-white border rounded-lg bg-white shadow-lg flex flex-col p-8 justify-center items-center transition ease-in-out duration-1000">
                            <TbCategoryPlus className="text-6xl"/>
                            <h1 className="text-2xl font-bold">{item.title}</h1>
                        </div>
                    ))
                }
              </div>
            </div>
        </Layout>
    )
}

export default Category; 