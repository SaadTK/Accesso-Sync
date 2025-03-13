import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus, Mail, Lock, User, ArrowRight, Loader } from "lucide-react";
import { motion } from "framer-motion";

const SignUpPage = () => {
  const loading = false;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          {" "}
          Create Your Account
        </h2>
      </motion.div>

      <motion.div
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="bg-gray-600 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form
            onSubmit={handleSubmit}
            className="block text-sm font-medium text-white"
          >


                      {/* name field start */}
            <div> 
              <label
                htmlFor="name"
                className="block text-sm font-medium text-white"
              >
                Full Name:
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-white" aria-hidden="true" />
                </div>

                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md
                    shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 sm:text-2xl"
                  placeholder="Your Name"
                />
              </div>{/* name field end */}
              </div>
                    
                      {/* email field start */}
            <div> 
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white"
              >
                Email Address:
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-white" aria-hidden="true" />
                </div>

                <input
                  type="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md
                    shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 sm:text-2xl"
                  placeholder="you@example.com"
                />
              </div>
                    {/* email field end */}


            </div>
                      {/* password field start */}
            <div> 
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white"
              >
                Password:
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-white" aria-hidden="true" />
                </div>

                <input
                  type="password"
                  id="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md
                    shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 sm:text-2xl"
                  placeholder="**********"
                />
              </div>
                    {/* password field end */}


            </div>
             {/* confirmPassword field start */}
             <div> 
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-white"
              >
               Confirm Password:
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-white" aria-hidden="true" />
                </div>

                <input
                  type="confirmPassword"
                  id="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  className="block w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md
                    shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 sm:text-2xl"
                  placeholder="**********"
                />
              </div>
                    {/* confirmPassword field end */}


            </div>

            <button type="submit" className="mt-3 w-full flex justify-center py-2 px-4 border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500
            transition duration-150 ease-in-out disabled:opacity-50" disabled={loading}>
{
  loading?(
    <>
    <Loader className="mr-2 h-5 w-5 animate-spin" aria-hidden='true'/>
    Loading....
    </>
  ):(
    <>
    <UserPlus className="mr-2 h-5 w-5" aria-hidden='true'/>
    Sign Up
    </>
  )
}

            </button>
          </form>

<p className="mt-8 text-center text-sm text-white">

  Already have an account? {" "}
  <Link to='/login' className="font-medium text-green-400 hover:text-emerald-600">
  Login Here <ArrowRight className="inline h-4 w-4" />
  </Link>
</p>
 </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
