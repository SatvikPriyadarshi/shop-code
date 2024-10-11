import Layout from "./Layout"


const Contact = ()=>{

    return (
        <Layout>
            <div className="bg-white md:w-6/12 shadow-lg border md:my-16 mx-auto">
               <img src="/images/contact.jpg" />
               <div className="p-8">
               <form className=" space-y-6">
                    <div className="flex flex-col">
                        <label className="font-semibold text-lg mb-1">FullName</label>
                        <input 
                        required
                        name="fullname"
                        placeholder="Er Satvik"
                        className="p-3 border border-gray-300 rounded"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-semibold text-lg mb-1">EmailId</label>
                        <input 
                        required
                        type ="email"
                        name="email"
                        placeholder="example@gmai.com"
                        className="p-3 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="font-semibold text-lg mb-1">Message</label>
                        <textarea
                        required
                        name="message"
                        placeholder="Enter you message here"
                        className="p-3 border border-gray-300 rounded"
                        rows={4}
                        />
                    </div>

                    <button className="py-3 px-8 rounded bg-blue-600 text-white font-semibold hover:bg-red-600 transition-all duration-300 ">Get Quote</button>
                </form>
               </div>
            </div>
        </Layout>
    )
}

export default Contact
































// import React, { useState } from 'react';
// import Swal from 'sweetalert2';
// import Layout from './Layout';

// const Contact = () => {
//   const [fullname, setFullname] = useState('');
//   const [email, setEmail] = useState('');
//   const [message, setMessage] = useState('');

//   const submitForm = (e) => {
//     e.preventDefault();
//     Swal.fire({
//         title: 'Success!',
//         text: 'form submitted successfully',
//         icon: 'success'
//     });
//   };

//   return (
//     <>
//       <Layout>
//       <div
//         style={{
//           display: 'flex',
//           padding: 64,
//           gap: 24,
//         }}
//       >
//         <img src="./images/contactus.svg" width="50%" alt="Contact Us" />

//         <div style={{ width: '50%' }}>
//           <form
//             onSubmit={submitForm}
//             style={{
//               display: 'flex',
//               flexDirection: 'column',
//               gap: 24,
//             }}
//           >
//             <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//               <label style={{ fontSize: 18, fontWeight: 500 }}>Fullname</label>
//               <input
//                 required
//                 type="text"
//                 name="fullname"
//                 value={fullname}
//                 onChange={(e) => setFullname(e.target.value)}
//                 placeholder="Enter name here"
//                 style={{
//                   border: '1px solid #ccc',
//                   borderRadius: 4,
//                   padding: 14,
//                 }}
//               />
//             </div>

//             <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//               <label style={{ fontSize: 18, fontWeight: 500 }}>Email</label>
//               <input
//                 required
//                 type="email"
//                 name="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Enter email here"
//                 style={{
//                   border: '1px solid #ccc',
//                   borderRadius: 4,
//                   padding: 14,
//                 }}
//               />
//             </div>

//             <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//               <label style={{ fontSize: 18, fontWeight: 500 }}>Message</label>
//               <textarea
//                 required
//                 name="message"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 placeholder="Write your message & query here"
//                 rows={6}
//                 style={{
//                   border: '1px solid #ccc',
//                   borderRadius: 4,
//                   padding: 14,
//                 }}
//               />
//             </div>
//             <button
//               type="submit"
//               style={{
//                 border: 'none',
//                 width: 'fit-content',
//                 padding: '14px 32px',
//                 borderRadius: 5,
//                 background: '#6C63FF',
//                 color: 'white',
//                 fontWeight: 600,
//               }}
//             >
//               SUBMIT
//             </button>
//           </form>
//         </div>
//       </div>
//       </Layout>
//     </>
//   );
// };

// export default Contact;
