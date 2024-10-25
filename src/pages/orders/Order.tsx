import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import OrderType from "../../types/OrderType";

function Order() {
    const [orders, setOrders] = useState<OrderType[]>([]);

    async function loadOrders() {
        try {
            const response = await axios.get("http://localhost:8080/orders");
            setOrders(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        loadOrders();
    }, []);

    const handleDelete = async (orderId: number) => {
        try {
            await axios.delete(`http://localhost:8080/orders/${orderId}`);
            loadOrders(); 
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="container mx-auto pt-5 pb-5">
            <h1 className="text-3xl font-semibold mb-5 text-center">Orders</h1>
            <Link to="/order/create" className="text-white bg-blue-500 hover:bg-blue-700 transition duration-300 font-semibold py-2 px-4 rounded mb-5 inline-block">
                Add Order
            </Link>
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse bg-white rounded-lg shadow-md overflow-hidden">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="py-3 px-5 text-left text-gray-600">Order ID</th>
                            <th className="py-3 px-5 text-left text-gray-600">Order Date and Time</th>
                            <th className="py-3 px-5 text-left text-gray-600">Total Amount</th>
                            <th className="py-3 px-5 text-left text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.orderId} className="hover:bg-gray-100 transition duration-300">
                                <td className="py-3 px-5 border-b border-gray-200">{order.orderId}</td>
                                <td className="py-3 px-5 border-b border-gray-200">{new Date(order.orderDateTime).toLocaleString()}</td>
                                <td className="py-3 px-5 border-b border-gray-200">Rs. {order.totalAmount.toFixed(2)}</td>
                                <td className="py-3 px-5 border-b border-gray-200 flex space-x-2">
                                    <Link to={`/order/edit/${order.orderId}`} className="text-blue-500 hover:underline">Edit</Link>
                                    <button 
                                        className="text-red-500 hover:underline"
                                        onClick={() => handleDelete(order.orderId)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Order;
