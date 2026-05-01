import { useState, useEffect } from "react";
import { getCampaigns, createCampaign, deleteCampaign, updateCampaign, updateStatus } from "../api";
import { jwtDecode } from "jwt-decode";

export default function Campaigns() {
    const [campaigns, setCampaigns] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [items, setItems] = useState([{ name: '', quantity: '' }]);
    const [isAdmin, setIsAdmin] = useState(false);

    const load = async () => {
        const data = await getCampaigns();
        setCampaigns(Array.isArray(data) ? data : []);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.role === 'admin') setIsAdmin(true);
            } catch (err) {}
        }
        load();
    }, []);

    const updateItem = (index, field, value) => {
        const updated = [...items];
        updated[index][field] = field === 'quantity' ? Number(value) : value;
        setItems(updated);
    };

    const addItem = () => {
        setItems([...items, { name: '', quantity: '' }]);
    };

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    return (
        <div className="p-6 mt-8">
            <h2 className="text-2xl font-bold mb-4">Campaigns</h2>

            {/* Create Campaign Form */}
            {isAdmin && (
                <div className="mb-8 bg-gray-50 p-4 rounded-lg shadow-sm">
                    <h3 className="text-xl mb-3">Create a Campaign</h3>
                
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Title:</label>
                    <input
                        className="border p-2 w-full max-w-md"
                        placeholder="Campaign Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Description:</label>
                    <textarea
                        className="border p-2 w-full max-w-md"
                        placeholder="Campaign Description"
                        rows="3"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Requested Items:</label>
                    {items.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                            <input
                                className="border p-2"
                                placeholder="Item name"
                                value={item.name}
                                onChange={(e) => updateItem(index, 'name', e.target.value)}
                            />
                            <input
                                className="border p-2 w-24"
                                type="number"
                                placeholder="Qty"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                            />
                            <button
                                className="bg-red-500 text-white px-2 py-1 rounded"
                                onClick={() => removeItem(index)}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                    <button
                        className="text-blue-500 underline text-sm"
                        onClick={addItem}
                    >
                        + Add Item
                    </button>
                </div>

                <button
                    className="bg-green-600 text-white px-4 py-2 rounded font-bold"
                    onClick={async () => {
                        const validItems = items.filter(i => i.name && i.quantity);
                        const res = await createCampaign({ title, description, items: validItems });
                        
                        if (res.message) {
                            alert("Error: " + res.message);
                        } else {
                            alert("Campaign created!");
                            setTitle('');
                            setDescription('');
                            setItems([{ name: '', quantity: '' }]);
                            load();
                        }
                    }}
                >
                    Submit Campaign
                </button>
            </div>
            )}

            {/* List of Campaigns */}
            <div>
                <h3 className="text-xl mb-3">All Campaigns</h3>
                <div className="space-y-3">
                    {campaigns?.map((c) => (
                        <div key={c.id} className="border p-4 flex justify-between items-center rounded bg-white shadow-sm">
                            <div>
                                <h4 className="font-bold">Campaign #{c.id}: {c.title}</h4>
                                <p className="text-sm text-gray-700 mb-1">{c.description}</p>
                                <p className="text-sm text-gray-700">Status: <span className="font-semibold text-blue-600">{c.status}</span></p>
                                {c.items && c.items.length > 0 && (
                                    <ul className="mt-2 text-sm list-disc list-inside text-gray-600">
                                        {c.items.map((item, i) => (
                                            <li key={i}>{item.name} — requested qty: {item.quantity}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {isAdmin && (
                                <div className="space-x-2">
                                    <button 
                                    className="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600"
                                    onClick={async () => {
                                        if (window.confirm("Are you sure you want to delete this campaign?")) {
                                            const res = await deleteCampaign(c.id);
                                            if (res.message && res.message !== 'Campaign deleted successfully') {
                                                alert("Error: " + res.message);
                                            } else {
                                                load();
                                            }
                                        }
                                    }}
                                >
                                    Delete
                                </button>

                                <button 
                                    className="bg-yellow-500 text-white px-3 py-1 text-sm rounded hover:bg-yellow-600"
                                    onClick={async () => {
                                        const newTitle = window.prompt("Enter new title:", c.title);
                                        if (newTitle && newTitle !== c.title) {
                                            const res = await updateCampaign(c.id, { title: newTitle, description: c.description });
                                            if (res.message) alert("Error: " + res.message);
                                            else load();
                                        }
                                    }}
                                >
                                    Edit
                                </button>

                                <button 
                                    className="bg-blue-500 text-white px-3 py-1 text-sm rounded hover:bg-blue-600"
                                    onClick={async () => {
                                        const res = await updateStatus(c.id, { status: "completed" });
                                        if (res.message) alert("Error: " + res.message);
                                        else load();
                                    }}
                                >
                                    Complete
                                </button>
                            </div>
                            )}
                        </div>
                    ))}
                    {(!campaigns || campaigns.length === 0) && <p className="text-gray-500">No campaigns found.</p>}
                </div>
            </div>
        </div>
    );
}