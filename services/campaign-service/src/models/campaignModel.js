const pool = require("../config/db");

const createCampaign = async (title, description, userId) => {
    const result = await pool.query(
        "INSERT INTO campaigns (title, description, created_by) VALUES ($1, $2, $3) RETURNING *",
        [title, description, userId]
    );

    return result.rows[0];
};

const getCampaigns = async () => {
    const result = await pool.query(`
        SELECT c.*, 
            COALESCE(json_agg(json_build_object('id', i.id, 'name', i.name, 'quantity', i.quantity)) 
            FILTER (WHERE i.id IS NOT NULL), '[]') AS items
        FROM campaigns c
        LEFT JOIN items i ON c.id = i.campaign_id
        GROUP BY c.id
    `);

    return result.rows;
};

const addItems = async (campaignId, items) => {
    for (const item of items) {
        await pool.query(
            'INSERT INTO items (campaign_id, name, quantity) VALUES ($1, $2, $3)',
            [campaignId, item.name, item.quantity]
        );
    }
};

module.exports = { createCampaign, getCampaigns, addItems };