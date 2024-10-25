import axios from "axios";
import { useEffect, useState } from "react";
import ItemCategoryType from "../types/ItemCategoryType";
import { useAuth } from "../context/AuthContext ";

function ItemCategory() {
    const { isAuthenticated, jwtToken } = useAuth();
    const [itemCategories, setItemCategories] = useState<ItemCategoryType[]>([]);
    const [categoryName, setCategoryName] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<ItemCategoryType | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const config = {
        headers: {
            Authorization: `Bearer ${jwtToken}`
        }
    };

    async function loadItemCategories() {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get("http://localhost:8080/itemcategory", config);
            setItemCategories(response.data);
        } catch (error) {
            console.error("Error loading item categories:", error);
            setError("Failed to load item categories. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (isAuthenticated) {
            loadItemCategories();
        }
    }, [isAuthenticated]);

    function handleCategoryName(event: React.ChangeEvent<HTMLInputElement>) {
        setCategoryName(event.target.value || "");
    }

    function validateCategoryName(): boolean {
        if (categoryName.trim().length < 3) {
            setError("Category name must be at least 3 characters long.");
            return false;
        }
        return true;
    }

    async function handleSubmit() {
        if (!validateCategoryName()) return;
        const data = { categoryName: categoryName.trim() };
        setError(null);

        try {
            if (selectedCategory) {
                await axios.put(`http://localhost:8080/itemcategory/${selectedCategory.categoryId}`, data, config);
            } else {
                await axios.post("http://localhost:8080/itemcategory", data, config);
            }

            setCategoryName("");
            setSelectedCategory(null);
            loadItemCategories();
        } catch (error) {
            console.error("Error saving item category:", error);
            setError("Failed to save the category. Please try again.");
        }
    }

    async function handleDelete(categoryId: number) {
        const confirmed = window.confirm("Are you sure you want to delete this category?");
        if (!confirmed) return;

        setError(null);

        try {
            await axios.delete(`http://localhost:8080/itemcategory/${categoryId}`, config);
            loadItemCategories();
        } catch (error) {
            console.error("Error deleting category:", error);
            setError("Failed to delete the category. Please try again.");
        }
    }

    function handleEdit(category: ItemCategoryType) {
        setCategoryName(category.categoryName || "");
        setSelectedCategory(category);
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Manage Item Categories</h1>

            {error && (
                <div className="bg-red-100 text-red-600 border border-red-600 rounded-lg p-4 mb-4 text-center">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="text-center text-lg">Loading categories...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {itemCategories.map((category) => (
                        <div key={category.categoryId} className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
                            <div className="text-gray-700 text-lg truncate">
                                {category.categoryName || "Unnamed Category"}
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full p-2"
                                    onClick={() => handleEdit(category)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11.828v2.586a1 1 0 001 1h2.586a1 1 0 00.707-.293l6.829-6.828a2 2 0 000-2.828l-3.536-3.536a2 2 0 00-2.828 0L9.707 5.293a1 1 0 00-.293.707v2.586z" />
                                    </svg>
                                </button>
                                <button
                                    className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2"
                                    onClick={() => handleDelete(category.categoryId)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <h2 className="text-2xl font-semibold mt-8 mb-4 text-center text-gray-800">Create or Update Item Category</h2>

            <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-6 max-w-md mx-auto">
                <form onSubmit={(e) => e.preventDefault()}>
                    <label className="text-gray-600 font-medium mb-2 block">Category Name</label>
                    <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500"
                        value={categoryName || ""}
                        onChange={handleCategoryName}
                        required
                    />
                    <button
                        type="button"
                        className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-lg font-semibold transition"
                        onClick={handleSubmit}
                    >
                        {selectedCategory ? "Update Category" : "Create Category"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ItemCategory;
