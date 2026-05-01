const BASE = "http://localhost:5000";
const getHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`
});

export const register = (data) => (
    fetch(`${BASE}/auth/register`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }
    ).then((res) => res.json()));


export const login = (data) => (
    fetch(`${BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    }).then((res) => res.json())
);

export const getCampaigns = () => (
    fetch(`${BASE}/api/campaigns`)
        .then((res) => res.json())

);

export const createCampaign = (data) => (
    fetch(`${BASE}/api/campaigns`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
);

export const deleteCampaign = (id) => (
    fetch(`${BASE}/api/campaigns/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
    })
        .then((res) => res.json())
);

export const updateCampaign = (id, data) => (
    fetch(`${BASE}/api/campaigns/${id}`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
);

export const updateStatus = (id, data) => (
    fetch(`${BASE}/api/campaigns/${id}/status`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
);

export const createDonation = (data) => (
    fetch(`${BASE}/api/donations`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
);


export const getDonations = () => (
    fetch(`${BASE}/api/donations`, {
        headers: getHeaders(),
    })
        .then((res) => res.json())
);

export const updateDonationStatus = (id, data) => (
    fetch(`${BASE}/api/donations/${id}/status`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
);

