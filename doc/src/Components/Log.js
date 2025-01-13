import { useState, useRef, useEffect } from 'react';
import { FileText, Users, Lock, ChevronRight } from 'lucide-react';
import Lottie from 'lottie-react';
import animation from './animation.json';
import Navbar from './Navbar';
import Footer from './Footer';
import { v4 as uuidV4 } from 'uuid';

function Log() {
  const idRef = useRef(null);
  const nameRef = useRef(null);
  const passRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://static-bundles.visme.co/forms/vismeforms-embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    const idValue = idRef.current?.value;
    const name = nameRef.current?.value;
    const pass = passRef.current?.value;

    if (!idValue || !name || !pass) {
      alert('Please fill in all fields to continue.');
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('Refreshtoken');
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: idValue, username: name, password: pass }),
      });

      if (response.status === 201) {
        alert('Success! Logging you in...');
      } else {
        alert('Authentication Failed. Please check your credentials.');
      }
    } catch (error) {
      alert('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar loc={uuidV4()} />
      <div className="min-h-screen bg-[#1a365d] flex items-center justify-center p-4 relative overflow-hidden w-screen">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] bg-blue-400 rounded-full blur-[120px] opacity-20" />
          <div className="absolute -bottom-[40%] -right-[20%] w-[80%] h-[80%] bg-blue-600 rounded-full blur-[120px] opacity-20" />
        </div>

        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 relative">
          {/* Login Form Section */}
          <div className="w-full max-w-md lg:ml-32 sm:ml-0 md:ml-0">
            {/* Logo Section */}
            <div className="flex flex-col items-center mb-8 text-white">
              <div className="bg-blue-500/20 p-4 rounded-2xl backdrop-blur-sm mb-4 border border-blue-400/20">
                <FileText className="w-12 h-12 text-blue-400" />
              </div>
              <h1 className="text-3xl font-bold mb-2">KP-DOCS</h1>
              <p className="text-blue-200 text-center">
                Collaborate and create documents together
              </p>
            </div>

            {/* Login Form */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-blue-100"
                    htmlFor="userId"
                  >
                    User ID
                  </label>
                  <div className="relative group">
                    <Users className="absolute left-3 top-3 h-5 w-5 text-blue-300 group-focus-within:text-blue-400 transition-colors" />
                    <input
                      id="userId"
                      type="number"
                      placeholder="Enter your user ID"
                      className="pl-10 bg-white/10 border border-white/20 text-white placeholder:text-blue-200/50 rounded-md py-2 focus:outline-none focus:border-blue-400 transition-all w-full"
                      ref={idRef}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-blue-100"
                    htmlFor="username"
                  >
                    Username
                  </label>
                  <div className="relative group">
                    <Users className="absolute left-3 top-3 h-5 w-5 text-blue-300 group-focus-within:text-blue-400 transition-colors" />
                    <input
                      id="username"
                      placeholder="Enter your username"
                      className="pl-10 bg-white/10 border border-white/20 text-white placeholder:text-blue-200/50 rounded-md py-2 focus:outline-none focus:border-blue-400 transition-all w-full"
                      ref={nameRef}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-blue-100"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-blue-300 group-focus-within:text-blue-400 transition-colors" />
                    <input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      className="pl-10 bg-white/10 border border-white/20 text-white placeholder:text-blue-200/50 rounded-md py-2 focus:outline-none focus:border-blue-400 transition-all w-full"
                      ref={passRef}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md flex items-center justify-center gap-2 ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </form>

              <div className="mt-6 text-center space-y-4">
                <p className="text-sm text-blue-200">
                  Don't have an account?
                  <a
                    href="/signup"
                    className="text-blue-400 hover:text-blue-300 ml-1 hover:underline"
                  >
                    Sign up
                  </a>
                </p>
                <p className="text-xs text-blue-300/80 font-medium">
                  Always remember your documents URL!
                </p>
              </div>
            </div>
          </div>

          {/* Animation Section */}
          <div className="w-full max-w-2xl">
            <Lottie animationData={animation} loop className="w-full h-full" />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Log;

// //
// import { useRef, useState, useEffect } from 'react';
// import Lottie from 'lottie-react';
// import animation from './animation.json';

// function Log() {
//   const idRef = useRef < HTMLInputElement > null;
//   const nameRef = useRef < HTMLInputElement > null;
//   const passRef = useRef < HTMLInputElement > null;
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     const script = document.createElement('script');
//     script.src = 'https://static-bundles.visme.co/forms/vismeforms-embed.js';
//     script.async = true;
//     document.body.appendChild(script);

//     return () => {
//       document.body.removeChild(script);
//     };
//   }, []);

//   const handleLogin = async (event) => {
//     event.preventDefault();

//     const idValue = idRef.current?.value;
//     const name = nameRef.current?.value;
//     const pass = passRef.current?.value;

//     if (!idValue || !name || !pass) {
//       alert('Please fill in all fields');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const token = localStorage.getItem('Refreshtoken');
//       const response = await fetch('http://localhost:3001/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ id: idValue, username: name, password: pass }),
//       });

//       if (response.status === 201) {
//         alert('Success! Logging you in...');
//         // history(`/documents/${uuidV4()}`);
//       } else {
//         alert('Authentication failed. Please check your credentials.');
//       }
//     } catch (error) {
//       alert('An error occurred. Please try again later.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#1a365d] flex items-center justify-center p-4 relative overflow-hidden">
//       {/* Decorative elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] bg-blue-400 rounded-full blur-[120px] opacity-20" />
//         <div className="absolute -bottom-[40%] -right-[20%] w-[80%] h-[80%] bg-blue-600 rounded-full blur-[120px] opacity-20" />
//       </div>

//       <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 relative">
//         {/* Login Form Section */}
//         <div className="w-full max-w-md">
//           {/* Logo Section */}
//           <div className="flex flex-col items-center mb-8 text-white">
//             <div className="bg-blue-500/20 p-4 rounded-2xl backdrop-blur-sm mb-4 border border-blue-400/20">
//               <svg
//                 className="w-12 h-12 text-blue-400"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//               >
//                 <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
//                 <polyline points="14 2 14 8 20 8"></polyline>
//                 <line x1="16" y1="13" x2="8" y2="13"></line>
//                 <line x1="16" y1="17" x2="8" y2="17"></line>
//                 <polyline points="10 9 9 9 8 9"></polyline>
//               </svg>
//             </div>
//             <h1 className="text-3xl font-bold mb-2">KP-DOCS</h1>
//             <p className="text-blue-200 text-center">
//               Collaborate and create documents together
//             </p>
//           </div>

//           {/* Login Form */}
//           <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
//             <form onSubmit={handleLogin} className="space-y-6">
//               <div className="space-y-2">
//                 <label
//                   className="text-sm font-medium text-blue-100"
//                   htmlFor="userId"
//                 >
//                   User ID
//                 </label>
//                 <input
//                   id="userId"
//                   type="number"
//                   placeholder="Enter your user ID"
//                   className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-blue-200/50 focus:border-blue-400 focus:outline-none transition-all"
//                   ref={idRef}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label
//                   className="text-sm font-medium text-blue-100"
//                   htmlFor="username"
//                 >
//                   Username
//                 </label>
//                 <input
//                   id="username"
//                   type="text"
//                   placeholder="Enter your username"
//                   className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-blue-200/50 focus:border-blue-400 focus:outline-none transition-all"
//                   ref={nameRef}
//                 />
//               </div>

//               <div className="space-y-2">
//                 <label
//                   className="text-sm font-medium text-blue-100"
//                   htmlFor="password"
//                 >
//                   Password
//                 </label>
//                 <input
//                   id="password"
//                   type="password"
//                   placeholder="Enter your password"
//                   className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-blue-200/50 focus:border-blue-400 focus:outline-none transition-all"
//                   ref={passRef}
//                 />
//               </div>

//               <button
//                 type="submit"
//                 className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 relative overflow-hidden group disabled:opacity-70"
//                 disabled={isLoading}
//               >
//                 <span className="relative z-10 flex items-center justify-center gap-2">
//                   {isLoading ? 'Signing in...' : 'Sign In'}
//                   <svg
//                     className="w-4 h-4 transform transition-transform group-hover:translate-x-1"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                   >
//                     <polyline points="9 18 15 12 9 6"></polyline>
//                   </svg>
//                 </span>
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 transform transition-transform group-hover:scale-105" />
//               </button>
//             </form>

//             <div className="mt-6 text-center space-y-4">
//               <p className="text-sm text-blue-200">
//                 Don't have an account?
//                 <a
//                   href="/signup"
//                   className="text-blue-400 hover:text-blue-300 ml-1 hover:underline"
//                 >
//                   Sign up
//                 </a>
//               </p>
//               <p className="text-xs text-blue-300/80 font-medium">
//                 Always remember your documents URL!
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Animation Section */}
//         <div className="w-full max-w-2xl">
//           <Lottie
//             animationData={animation}
//             loop={true}
//             className="w-full h-full filter brightness-110 mix-blend-lighten"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Log;
