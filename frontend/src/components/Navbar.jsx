import React from "react";
import { Lock, LogIn, LogOut, ShoppingCart, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const user = false;
  const isAdmin = false;

  return (
    <header className="fixed top-0 left-0 w-full bg-green-600 opacity-70 backdrop-blur-md shadow-lg z-40 transition-all duration-300 border-b border-emerald-800">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to={"/"} className="text-2xl font-bold text-yellow-300 flex items-center space-x-2">
          AccessoSync
        </Link>

        <nav className="flex items-center gap-4">
          <Link to={"/"} className="text-white hover:text-yellow-300 transition duration-300 ease-in-out text-xl">
            Home
          </Link>

          {user && (
            <Link to={"/cart"} className="relative group text-white hover:text-yellow-300 transition duration-300 ease-in-out">
              <ShoppingCart className="inline-block mr-1 group-hover:text-red-400" size={20} ></ShoppingCart>
              <span className="hidden sm:inline text-xl group-hover:text-red-400">Cart</span>
              <span className="absolute -top-3 -left-3 bg-emerald-400 text-white rounded-full px-2 py-0.5 text-xs group-hover:bg-red-400 transition duration-300 ease-in-out">
                3
              </span>
            </Link>
          )}

          {isAdmin && (
            <Link className="bg-green hover:bg-teal-400 text-white px-3 py-2 rounded-md font-medium transition duration-300 ease-in-out flex items-center">
              <Lock className="inline-block mr-1" size={18} />
              <span className="hidden sm:inline text-xl">Dashboard</span>
            </Link>
          )}

          {user ? (
            <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out">
              <LogOut className="mr-2" size={18} />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          ) : (
            <>
              <Link to={"/signup"} className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out">
                <UserPlus className="mr-2" size={18} />
                Sign Up
              </Link>
              <Link to={"/login"} className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center transition duration-300 ease-in-out">
                <LogIn className="mr-2" size={18} />
                Login
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
