import { useState, useEffect } from "react";
import { getDonations, createDonation, updateDonationStatus, getCampaigns } from "../api";

export default function Donations() {
    const [donations, setDonations] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [selectedCampaignId, setSelectedCampaignId] = useState('');
    const [items, setItems] = useState([{ name: '', quantity: '' }]);

    const loadData = async () => {
        try {
            const [dons, camps] = await Promise.all([getDonations(), getCampaigns()]);
            setDonations(Array.isArray(dons) ? dons : []);
            setCampaigns(Array.isArray(camps) ? camps : []);
        } catch (error) {
            console.error("Failed to load data:", error);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const updateItem = (index, field, value) => {
        const updated = [...items];
        updated[index][field] = field === 'quantity' ? Number(value) : value;
        setItems(updated);
    };

    const addItem = () => setItems([...items, { name: '', quantity: '' }]);
    const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

    const handleDonate = async () => {
        if (!selectedCampaignId) {
            return alert("Please select a campaign");
        }
        const validItems = items.filter(i => i.name && i.quantity);
        if (validItems.length === 0) {
            return alert("Please add at least one valid item");
        }

        const res = await createDonation({ campaign_id: selectedCampaignId, items: validItems });
        if (res.message && res.message !== 'Donation created successfully') {
            alert("Error: " + res.message);
        } else {
            alert("Donation created!");
            setSelectedCampaignId('');
            setItems([{ name: '', quantity: '' }]);
            loadData();
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        const res = await updateDonationStatus(id, { status: newStatus });
        if (res.message) alert("Error: " + res.message);
        else loadData();
    };

    return (
        <div className="p-6 mt-8 border-t-2 border-dashed">
            <h2 className="text-2xl font-bold mb-4">Donations</h2>

            {/* Create Donation Form */}
            <div className="mb-8 bg-gray-50 p-4 rounded-lg shadow-sm">
                <h3 className="text-xl mb-3">Make a Donation</h3>
                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Select Campaign:</label>
                    <select 
                        className="border p-2 w-full max-w-md" 
                        value={selectedCampaignId} 
                        onChange={(e) => setSelectedCampaignId(e.target.value)}
                    >
                        <option value="">-- Choose a Campaign --</option>
                        {campaigns?.filter(c => c.status === 'active').map(c => (
                            <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block mb-1 font-semibold">Items to Donate:</label>
                    {items.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                            <input
                                className="border p-2"
                                placeholder="Item name (e.g. blankets)"
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
                    <button className="text-blue-500 underline text-sm" onClick={addItem}>
                        + Add Item
                    </button>
                </div>

                <button className="bg-green-600 text-white px-4 py-2 rounded font-bold" onClick={handleDonate}>
                    Submit Donation
                </button>
            </div>

            {/* List of Donations */}
            <div>
                <h3 className="text-xl mb-3">All Donations</h3>
                <div className="space-y-3">
                    {donations?.map(d => {
                        const camp = campaigns.find(c => c.id === d.campaign_id);
                        return (
                            <div key={d.id} className="border p-4 flex justify-between items-center rounded bg-white shadow-sm">
                                <div>
                                    <h4 className="font-bold">Donation #{d.id}</h4>
                                    <p className="text-sm text-gray-700">Campaign: {camp ? camp.title : `ID ${d.campaign_id}`}</p>
                                    <p className="text-sm text-gray-700">Status: <span className="font-semibold text-blue-600">{d.status}</span></p>
                                </div>
                                
                                <div className="space-x-2">
                                    <button 
                                        className="bg-gray-200 px-3 py-1 text-sm rounded hover:bg-gray-300"
                                        onClick={() => handleUpdateStatus(d.id, 'committed')}
                                    >
                                        Committed
                                    </button>
                                    <button 
                                        className="bg-yellow-200 px-3 py-1 text-sm rounded hover:bg-yellow-300"
                                        onClick={() => handleUpdateStatus(d.id, 'received')}
                                    >
                                        Received
                                    </button>
                                    <button 
                                        className="bg-green-200 px-3 py-1 text-sm rounded hover:bg-green-300"
                                        onClick={() => handleUpdateStatus(d.id, 'distributed')}
                                    >
                                        Distributed
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    {(!donations || donations.length === 0) && <p className="text-gray-500">No donations found.</p>}
                </div>
            </div>
        </div>
    );
}
