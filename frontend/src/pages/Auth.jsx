import { useState } from "react";
import { register, login } from "../api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('donor');
    const navigate = useNavigate();

    const handleLogin = async () => {
        const res = await login({ email, password });
        if (res.token) {
            localStorage.setItem("token", res.token);
            try {
                const decoded = jwtDecode(res.token);
                if (decoded.role === 'admin') {
                    navigate('/campaigns');
                } else {
                    navigate('/donations');
                }
            } catch (err) {
                console.error("Invalid token", err);
                navigate('/donations');
            }
        } else {
            alert(res.message || "Login failed");
        }
    };

    const handleRegister = async () => {
        const res = await register({ email, password, role });
        if (res.user) {
            alert("Registered Successfully! Please log in.");
        } else {
            alert(res.message || "Registration failed");
        }
    };

    return (
        <div className="max-w-sm mx-auto bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h2 className="text-2xl font-extrabold mb-5 text-center text-gray-800">Welcome</h2>
            <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input className="border border-gray-300 p-2.5 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" type="email" placeholder="example@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                <input className="border border-gray-300 p-2.5 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Role <span className="text-gray-400 font-normal">(For Registration)</span></label>
                <select className="border border-gray-300 p-2.5 w-full rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="donor">Donor</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <div className="flex gap-3">
                <button className="bg-blue-600 text-white py-2.5 rounded-lg w-full font-bold hover:bg-blue-700 transition-colors shadow-sm" onClick={handleLogin}>Login</button>
                <button className="bg-green-600 text-white py-2.5 rounded-lg w-full font-bold hover:bg-green-700 transition-colors shadow-sm" onClick={handleRegister}>Register</button>
            </div>
        </div>
    );
}