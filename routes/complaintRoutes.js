const express = require('express');
const { lodgeComplaint, getComplaints } = require('../controllers/complaintController');
const router = express.Router();

const mockAuth = (req, res, next) => {
    req.user = { id: req.headers['user-id'] || '65f123456789abcdef123456', role: req.headers['user-role'] || 'Customer' };
    next();
};

router.post('/', mockAuth, lodgeComplaint);
router.get('/', mockAuth, getComplaints);

module.exports = router;
