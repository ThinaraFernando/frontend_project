import { useEffect, useState } from "react";
import axios from "axios";
import ItemType from "../types/ItemType";
import ItemCategoryType from "../types/ItemCategoryType";
import { useAuth } from "../context/AuthContext ";

function Items() {
    const { isAuthenticated, jwtToken } = useAuth();

    const [items, setItems] = useState<ItemType[]>([]);
    const [form, setForm] = useState({
        itemName: "",
        itemPrice: 0,
        qty: 0,
        itemCategoryId: 0,
    });
    const [itemEditing, setItemEditing] = useState<ItemType | null>(null);
    const [itemCategories, setItemCategories] = useState<ItemCategoryType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const config = {
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
    };

    useEffect(() => {
        if (isAuthenticated) {
            getItems();
            loadItemCategories();
        }
    }, [isAuthenticated]);

    async function getItems() {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:8080/item", config);
            setItems(response.data);
        } catch (error) {
            setError("Failed to load items.");
            console.error("Error fetching items:", error); 
        } finally {
            setLoading(false);
        }
    }

    async function loadItemCategories() {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:8080/itemcategory", config);
            setItemCategories(response.data);
        } catch (error) {
            setError("Failed to load categories.");
            console.error("Error fetching categories:", error); 
        } finally {
            setLoading(false);
        }
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = event.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === "itemCategoryId" ? parseInt(value, 10) : value,
        }));
    }

    async function saveItem() {
        setLoading(true);
        try {
            await axios.post(
                "http://localhost:8080/item",
                {
                    name: form.itemName,
                    price: form.itemPrice,
                    qty: form.qty,
                    itemCategory: { categoryId: form.itemCategoryId },
                },
                config
            );
            getItems();
            clearForm();
        } catch (error) {
            setError("Failed to save item.");
            console.error("Error saving item:", error);
        } finally {
            setLoading(false);
        }
    }

    function editItem(item: ItemType) {
        setItemEditing(item);
        setForm({
            itemName: item.name,
            itemPrice: item.price,
            qty: item.qty,
            itemCategoryId: item.itemCategory.categoryId,
        });
    }

    async function updateItem() {
        if (!itemEditing) return;
        setLoading(true);
        try {
            await axios.put(
                `http://localhost:8080/item/${itemEditing.id}`,
                {
                    name: form.itemName,
                    price: form.itemPrice,
                    qty: form.qty,
                    itemCategory: { categoryId: form.itemCategoryId },
                },
                config
            );
            getItems();
            clearForm();
        } catch (error) {
            setError("Failed to update item.");
            console.error("Error updating item:", error);
        } finally {
            setLoading(false);
        }
    }

    function clearForm() {
        setForm({
            itemName: "",
            itemPrice: 0,
            qty: 0,
            itemCategoryId: 0,
        });
        setItemEditing(null);
    }

    return (
        <div className="container mx-auto pt-10 pb-5 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 text-gray-800 text-center sm:text-left">Items Management</h1>

            {error && (
                <div className="mb-4 text-red-600">
                    {error}
                </div>
            )}

            <div className="shadow-lg rounded-lg overflow-hidden mb-8">
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Item ID</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Name</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Price</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Quantity</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Category</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4 text-sm text-gray-700">{item.id}</td>
                                    <td className="py-3 px-4 text-sm text-gray-700">{item.name}</td>
                                    <td className="py-3 px-4 text-sm text-gray-700">Rs{item.price}</td>
                                    <td className="py-3 px-4 text-sm text-gray-700">{item.qty}</td>
                                    <td className="py-3 px-4 text-sm text-gray-700">
                                        {item.itemCategory?.categoryName}
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-700">
                                        <button
                                            className="text-blue-500 hover:text-blue-700 font-medium mr-4"
                                            onClick={() => editItem(item)}
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">
                    {itemEditing ? 'Edit Item' : 'Add Item'}
                </h2>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                        Item Name
                    </label>
                    <input
                        type="text"
                        name="itemName"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-indigo-500"
                        value={form.itemName}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                        Item Price
                    </label>
                    <input
                        type="number"
                        name="itemPrice"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-indigo-500"
                        value={form.itemPrice}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                        Quantity
                    </label>
                    <input
                        type="number"
                        name="qty"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-indigo-500"
                        value={form.qty}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-600 mb-2">
                        Item Category
                    </label>
                    <select
                        name="itemCategoryId"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-indigo-500"
                        value={form.itemCategoryId}
                        onChange={handleChange}
                    >
                        <option value="">Select Category</option>
                        {itemCategories.map((category) => (
                            <option key={category.categoryId} value={category.categoryId}>
                                {category.categoryName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col sm:flex-row sm:space-x-4 mt-4">
                    <button
                        onClick={itemEditing ? updateItem : saveItem}
                        className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-semibold mb-2 sm:mb-0"
                    >
                        {itemEditing ? "Update Item" : "Add Item"}
                    </button>
                    <button
                        onClick={clearForm}
                        className="w-full sm:w-auto bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 font-semibold"
                    >
                        Clear
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Items;
