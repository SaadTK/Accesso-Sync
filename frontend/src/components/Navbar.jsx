import React from "react";
import { Lock, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const user = true;
  const isAdmin = true;
  return (
    <header
      className="fixed top-0 left-0 w-full bg-green-600 opacity-70 backdrop-blur-md shadow-lg z-40
      transition-all duration-300 border-b border-emerald-800"
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to={"/"} className="text-2xl font-bold text-yellow-300 flex items-center space-x-2">
          AccessoSync
        </Link>

        <nav className="flex items-center gap-4">
<Link to={"/"} className="text-white hover:text-yellow-300 transition duration-300 ease-in-out"
>
  Home
</Link>

          {user && (
            <Link to={"/cart"} className="relative group text-white hover:text-yellow-300 transition duration-300 ease-in-out">
              <ShoppingCart className="inline-block mr-1 group-hover:text-red-400" size={20} />
              <span className="hidden sm:inline">Cart</span>
<span className="absolute -top-3 -right-3 bg-emerald-400 text-white rounded-full px-2 py-0.5 text-xs group-hover:bg-red-400 transition duration-300 ease-in-out">
  3
</span>


            </Link>
          )}
          {isAdmin && (
            <Link className="bg-green hover:bg-teal-400 text-white px-3 py-2 rounded-md font-medium transition duration-300 ease-in-out flex items-center">
              <Lock className="inline-block mr-1" size={18}/>
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
)}

{user ? (
  <button className=""></button>
) : ()}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
