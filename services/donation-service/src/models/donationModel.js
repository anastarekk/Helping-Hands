const pool = require('../config/db');


const createDonation = async (user_id, campaign_id) => {
    const result = await pool.query(`INSERT INTO donations(user_id,campaign_id) VALUES ($1,$2) RETURNING *`, [user_id, campaign_id]);
    return result.rows[0];
};

const addItems = async (donation_id, items) => {
    for (let item of items) {
        await pool.query(`INSERT INTO donations_items(donation_id,item_name,quantity) VALUES ($1,$2,$3)`, [donation_id, item.name, item.quantity]);
    }
};

const getDonations = async () => {
    const result = await pool.query(`SELECT * FROM donations`)
    return result.rows;
};

const updateStatus = async (Id, status) => {
    const result = await pool.query(`UPDATE donations SET status = $1 WHERE id = $2 RETURNING *`, [status, Id])
    return result.rows[0];
};

const getDonatedItemsForCampaign = async (campaign_id) => {
    const result = await pool.query(`
        SELECT di.item_name, SUM(di.quantity) as total_donated
        FROM donations_items di
        JOIN donations d ON di.donation_id = d.id
        WHERE d.campaign_id = $1
        GROUP BY di.item_name
    `, [campaign_id]);
    return result.rows;
};

module.exports = { createDonation, addItems, getDonations, updateStatus, getDonatedItemsForCampaign };