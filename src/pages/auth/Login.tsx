import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext ";

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    async function submit(event: any) {
        event.preventDefault();
        if (username === "" || password === "") { 
            setError("Username and password are required");
            return; 
        }

        const data = {
            username,
            password,
        };

        try {
            const response = await axios.post("http://localhost:8080/auth/login", data);
            login(response.data);
            navigate("/");
        } catch (error) {
            setError("There was an error logging in");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back!</h1>
                <form onSubmit={submit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1" htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(event) => {
                                setUsername(event.target.value);
                                setError("");
                            }}
                            className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(event) => {
                                setPassword(event.target.value);
                                setError("");
                            }}
                            className="block w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    {error && <div className="text-sm text-red-500 text-center mb-4">{error}</div>}
                    <div>
                        <button
                            type="submit"
                            className="bg-gray-800 text-white px-4 py-2 rounded-lg w-full hover:bg-gray-700 transition duration-200 ease-in-out"
                        >
                            Login
                        </button>
                    </div>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">Don't have an account? <a href="/auth/signup" className="text-gray-800 font-semibold hover:underline">Sign up</a></p>
                </div>
            </div>
        </div>
    );
}

export default Login;
