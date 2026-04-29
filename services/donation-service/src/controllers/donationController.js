const { createDonation, addItems, getDonations, updateStatus } = require('../models/donationModel');
const axios = require('axios');

const CAMPAIGN_SERVICE_URL = process.env.CAMPAIGN_SERVICE_URL || 'http://campaign-service:4000';

const create = async (req, res) => {
    const { campaign_id, items } = req.body;
    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'items are required' });
    }


    let campaign;
    try {
        const campaignRes = await axios.get(`${CAMPAIGN_SERVICE_URL}/api/campaigns/${campaign_id}`);
        campaign = campaignRes.data;
        if (campaign.status !== 'active') {
            return res.status(400).json({ message: 'Campaign is not active' });
        }
    } catch (err) {
        if (err.response && err.response.status === 404) {
            return res.status(404).json({ message: 'Campaign not found' });
        }
        return res.status(500).json({ message: 'Failed to verify campaign', error: err.message });
    }


    for (const donatedItem of items) {
        const requiredItem = campaign.items.find(i => i.name === donatedItem.name);
        if (!requiredItem) {
            return res.status(400).json({ message: `Item "${donatedItem.name}" is not needed by this campaign` });
        }
        if (donatedItem.quantity > requiredItem.quantity) {
            return res.status(400).json({
                message: `Quantity for "${donatedItem.name}" exceeds needed amount (needed: ${requiredItem.quantity}, donated: ${donatedItem.quantity})`
            });
        }
    }

    const donation = await createDonation(req.user.id, campaign_id);
    await addItems(donation.id, items);

    return res.status(201).json({ message: 'Donation created successfully' });

};

const getAll = async (req, res) => {
    const donations = await getDonations();
    return res.status(200).json(donations);
}

const changeStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ['committed', 'received', 'distributed'];
    if (!allowed.includes(status)) {
        return res.status(400).json({ message: 'invalid status' });
    }

    const updated = await updateStatus(id, status);
    return res.status(200).json(updated);
};

module.exports = { create, getAll, changeStatus };
