const express = require('express');
const router = express.Router();

const auth = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');
const { create, list, getById, updateStatus, updateCampaign, softDeleteCampaign } = require('../controllers/campaignController');

router.get('/', list);
router.get('/:id', getById);
router.post(
    '/',
    auth,
    authorize(['admin']),
    create
);

router.patch(
    '/:id',
    auth,
    authorize(['admin']),
    updateCampaign
);

router.patch(
    '/:id/status',
    auth,
    authorize(['admin']),
    updateStatus
);

router.delete(
    '/:id',
    auth,
    authorize(['admin']),
    softDeleteCampaign
);

module.exports = router;