import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext ";

function Home() {
    const { logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-4 md:p-8">
                <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-4 md:mb-6">
                    Point of Sale Dashboard
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <Link to="/categories" className="bg-green-600 text-white px-4 md:px-6 py-3 md:py-4 rounded-lg text-center font-semibold hover:bg-green-700 transition">
                        Item Categories
                    </Link>
                    
                    <Link to="/items" className="bg-blue-600 text-white px-4 md:px-6 py-3 md:py-4 rounded-lg text-center font-semibold hover:bg-blue-700 transition">
                        Manage Items
                    </Link>
                    
                    <Link to="/stock" className="bg-yellow-600 text-white px-4 md:px-6 py-3 md:py-4 rounded-lg text-center font-semibold hover:bg-yellow-700 transition">
                        Manage Stock
                    </Link>

                    <Link to="/customer" className="bg-purple-600 text-white px-4 md:px-6 py-3 md:py-4 rounded-lg text-center font-semibold hover:bg-purple-700 transition">
                        Manage Customers
                    </Link>

                    <Link to="/orders" className="bg-red-600 text-white px-4 md:px-6 py-3 md:py-4 rounded-lg text-center font-semibold hover:bg-red-700 transition">
                        Manage Orders
                    </Link>

                    <button
                        className="bg-gray-800 text-white px-4 md:px-6 py-3 md:py-4 rounded-lg text-center font-semibold hover:bg-gray-900 transition"
                        onClick={logout}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Home;
