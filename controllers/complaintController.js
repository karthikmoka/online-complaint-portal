const Complaint = require('../models/Complaint');

exports.lodgeComplaint = async (req, res) => {
    try {
        const { title, category, description, attachmentUrl } = req.body;
        const newComplaint = new Complaint({
            user: req.user.id,
            title,
            category,
            description,
            attachmentUrl
        });
        await newComplaint.save();
        res.status(201).json(newComplaint);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getComplaints = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'Customer') query = { user: req.user.id };
        if (req.user.role === 'Agent') query = { assignedAgent: req.user.id };

        const complaints = await Complaint.find(query).populate('user', 'name email');
        res.json(complaints);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
