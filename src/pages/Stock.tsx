import { useEffect, useState } from "react";
import axios from "axios";
import StockType from "../types/StockType";
import ItemType from "../types/ItemType";
import { useAuth } from "../context/AuthContext ";

function Stocks() {
    const { isAuthenticated, jwtToken } = useAuth();

    const [stocks, setStocks] = useState<StockType[]>([]);
    const [stockId, setStockId] = useState<number | null>(null);
    const [quantityAvailable, setQuantityAvailable] = useState<number>(0);
    const [stockEditing, setStockEditing] = useState<StockType | null>(null);
    const [items, setItems] = useState<ItemType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const config = {
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
    };

    function handleQuantityAvailable(event: any) {
        setQuantityAvailable(Number(event.target.value));
    }

    async function getStocks() {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get("http://localhost:8080/stock", config);
            setStocks(response.data);
        } catch (err) {
            setError("Failed to fetch stock data.");
        } finally {
            setLoading(false);
        }
    }

    async function saveStock() {
        if (quantityAvailable < 0) {
            setError("Quantity cannot be negative.");
            return;
        }
        setError(null);
        try {
            await axios.post(
                "http://localhost:8080/stock",
                {
                    stockId: stockId,
                    quantityAvailable: quantityAvailable,
                    items: items,
                },
                config
            );
            getStocks();
            clearForm();
        } catch (error) {
            setError("Failed to save stock.");
        }
    }

    async function updateStock() {
        if (quantityAvailable < 0) {
            setError("Quantity cannot be negative.");
            return;
        }
        setError(null);
        try {
            await axios.put(
                `http://localhost:8080/stock/${stockEditing?.stockId}`,
                {
                    stockId: stockEditing?.stockId,
                    quantityAvailable: quantityAvailable,
                    items: items,
                },
                config
            );
            getStocks();
            clearForm();
        } catch (error) {
            setError("Failed to update stock.");
        }
    }

    async function deleteStock(stockId: number) {
        setError(null);
        try {
            await axios.delete(`http://localhost:8080/stock/${stockId}`, config);
            getStocks();
        } catch (error) {
            setError("Failed to delete stock.");
        }
    }

    function editStock(stock: StockType) {
        setStockEditing(stock);
        setStockId(stock.stockId);
        setQuantityAvailable(stock.quantityAvailable);
        setItems(stock.items || []);
    }

    function clearForm() {
        setStockEditing(null);
        setStockId(null);
        setQuantityAvailable(0);
        setItems([]);
        setError(null);
    }

    useEffect(() => {
        if (isAuthenticated) {
            getStocks();
        }
    }, [isAuthenticated]);

    return (
        <div className="container mx-auto pt-10 pb-5">
            <h1 className="text-4xl font-bold mb-8 text-gray-800">Stock Management</h1>

            {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>}

            {loading ? (
                <div>Loading stocks...</div>
            ) : (
                <div className="shadow-lg rounded-lg overflow-hidden mb-8">
                    <div className="overflow-x-auto"> {/* Enable horizontal scroll for small screens */}
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Stock ID</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Quantity Available</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Items</th>
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stocks.map((stock) => (
                                    <tr key={stock.stockId} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-4 text-sm text-gray-700">{stock.stockId}</td>
                                        <td className="py-3 px-4 text-sm text-gray-700">{stock.quantityAvailable}</td>
                                        <td className="py-3 px-4 text-sm text-gray-700">
                                            <ul>
                                                {stock.items.map(item => (
                                                    <li key={item.id}>
                                                        {item.name} (Qty: {item.qty}, Price: ${item.price}, Category: {item.itemCategory?.categoryName})
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-gray-700">
                                            <button
                                                className="text-blue-500 hover:text-blue-700 font-medium me-4"
                                                onClick={() => editStock(stock)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="text-red-500 hover:text-red-700 font-medium"
                                                onClick={() => deleteStock(stock.stockId)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className="p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                    {stockEditing ? 'Edit Stock' : 'Add Stock'}
                </h2>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                        Quantity Available
                    </label>
                    <input
                        type="number"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-indigo-500"
                        value={quantityAvailable}
                        onChange={handleQuantityAvailable}
                    />
                </div>

                {stockEditing ? (
                    <button
                        className="w-full py-2 px-4 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none"
                        onClick={updateStock}
                    >
                        Update Stock
                    </button>
                ) : (
                    <button
                        className="w-full py-2 px-4 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 focus:outline-none"
                        onClick={saveStock}
                    >
                        Add Stock
                    </button>
                )}
            </div>
        </div>
    );
}

export default Stocks;
