const express = require('express');
const router = express.Router();
const { create, getAll, changeStatus } = require('../controllers/donationController');
const auth = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

router.post('/', auth, create);
router.get('/', auth, getAll);
router.patch('/:id/status', auth, authorize(['admin']), changeStatus);

module.exports = router;


