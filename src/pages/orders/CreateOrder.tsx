import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderDetailType from "../../types/OrderDetailType";
import ItemType from "../../types/ItemType";

function CreateOrder() {
    const [items, setItems] = useState<ItemType[]>([]);
    const [orderDetails, setOrderDetails] = useState<OrderDetailType[]>([]);
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [customerId, setCustomerId] = useState<number | null>(null);
    const [userId, setUserId] = useState<number | null>(null);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    async function getItems() {
        try {
            const response = await axios.get("http://localhost:8080/item");
            setItems(response.data);
        } catch (error) {
            setError("Failed to fetch items.");
            console.error("Error fetching items:", error);
        }
    }

    useEffect(() => {
        getItems();
    }, []);

    function addItemToOrder(item: ItemType) {
        const existingDetail = orderDetails.find(detail => detail.item.itemId === item.id);
        if (existingDetail) {
            const updatedDetails = orderDetails.map(detail => {
                if (detail.item.itemId === item.id) {
                    const updatedDetail = {
                        ...detail,
                        quantity: detail.quantity + 1,
                        totalPrice: (detail.quantity + 1) * item.price
                    };
                    setTotalAmount(prevTotal => prevTotal + item.price);
                    return updatedDetail;
                }
                return detail;
            });
            setOrderDetails(updatedDetails);
        } else {
            const newOrderDetail: OrderDetailType = {
                orderDetailId: 0,
                quantity: 1,
                totalPrice: item.price,
                item: {
                    itemId: item.id,
                    itemName: item.name,
                    unitPrice: item.price,
                },
            };
            setOrderDetails([...orderDetails, newOrderDetail]);
            setTotalAmount(prevTotal => prevTotal + item.price);
        }
    }

    async function saveOrder() {
        setLoading(true);
        try {
            const orderRequestDto = {
                customerId: customerId,
                userId: userId,
                paymentMethod: paymentMethod,
                items: orderDetails.map(detail => ({
                    itemId: detail.item.itemId,
                    quantity: detail.quantity,
                })),
            };

            await axios.post("http://localhost:8080/orders", orderRequestDto);
            navigate("/orders");
        } catch (error) {
            setError("Failed to save order. Please try again.");
            console.error("Error saving order:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-lg mt-10">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">Create New Order</h2>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Customer ID:</label>
                    <input
                        type="number"
                        onChange={(e) => setCustomerId(Number(e.target.value))}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Enter Customer ID"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">User ID:</label>
                    <input
                        type="number"
                        onChange={(e) => setUserId(Number(e.target.value))}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Enter User ID"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Payment Method:</label>
                    <input
                        type="text"
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        placeholder="e.g., Cash, Credit"
                    />
                </div>
            </div>

            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Available Items</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="bg-gray-100 p-4 rounded-lg hover:shadow-lg cursor-pointer transition"
                        onClick={() => addItemToOrder(item)}
                    >
                        <h4 className="text-xl font-medium text-gray-800">{item.name}</h4>
                        <p className="text-gray-600">Price: Rs. {item.price}</p>
                    </div>
                ))}
            </div>

            <div className="mt-10">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Order Details</h3>
                {orderDetails.length === 0 ? (
                    <p className="text-gray-600">No items added to the order yet.</p>
                ) : (
                    <ul className="space-y-4">
                        {orderDetails.map((detail) => (
                            <li key={detail.orderDetailId} className="flex justify-between items-center">
                                <span>
                                    {detail.item.itemName} - Quantity: {detail.quantity}
                                </span>
                                <span className="text-right">Total: Rs. {detail.totalPrice}</span>
                            </li>
                        ))}
                    </ul>
                )}
                <h4 className="text-xl font-semibold mt-4">Grand Total: Rs. {totalAmount}</h4>
            </div>

            <button
                onClick={saveOrder}
                disabled={loading}
                className={`mt-6 w-full p-3 text-white font-medium rounded-lg ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'} transition`}
            >
                {loading ? 'Processing Order...' : 'Save Order'}
            </button>
        </div>
    );
}

export default CreateOrder;
