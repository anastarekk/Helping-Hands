const { createCampaign, getCampaigns, addItems } = require('../models/campaignModel');
const pool = require("../config/db");

const create = async (req, res) => {
    const { title, description, items } = req.body;
    const campaign = await createCampaign(
        title,
        description,
        req.user.userId
    );

    if (items && items.length > 0) {
        await addItems(campaign.id, items);
    }

    res.status(201).json(campaign);
};

const list = async (req, res) => {
    const campaigns = await getCampaigns();

    res.status(200).json(campaigns);
};

const getById = async (req, res) => {
    const { id } = req.params;
    const result = await pool.query(`
        SELECT c.*, 
            COALESCE(json_agg(json_build_object('id', i.id, 'name', i.name, 'quantity', i.quantity)) 
            FILTER (WHERE i.id IS NOT NULL), '[]') AS items
        FROM campaigns c
        LEFT JOIN items i ON c.id = i.campaign_id
        WHERE c.id = $1
        GROUP BY c.id
    `, [id]);

    if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Campaign not found' });
    }

    res.status(200).json(result.rows[0]);
};

const updateStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ['active', 'paused', 'completed', 'cancelled'];

    if (!allowed.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' })
    }

    const result = await pool.query(
        'UPDATE campaigns SET status = $1 WHERE id = $2 RETURNING *',
        [status, id]
    );

    res.json(result.rows[0]);
};

const updateCampaign = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    const result = await pool.query(
        'UPDATE campaigns SET title = $1 , description = $2 WHERE id = $3 RETURNING *',
        [title, description, id]
    );
    res.json(result.rows[0]);
};

const softDeleteCampaign = async (req, res) => {
    const { id } = req.params;

    const result = await pool.query(
        'DELETE FROM campaigns WHERE id = $1 RETURNING *',
        [id]
    );
    res.json({ message: 'Campaign deleted successfully' });
}



module.exports = { create, list, getById, updateStatus, updateCampaign, softDeleteCampaign };