const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const TicketHistory = require('../models/TicketHistory');
const sendEmail = require('../utils/sendEmail');
const upload = require('../middleware/upload');

// @route   POST /api/complaints
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { user, title, description, category } = req.body;
        const imageUrl = req.file ? (req.file.path || req.file.secure_url) : '';

        const newComplaint = new Complaint({
            user, title, description, category, imageUrl
        });

        const savedComplaint = await newComplaint.save();

        // 1. WebSocket Broadcast
        const io = req.app.get('io');
        if (io) io.emit('newTicketCreated', savedComplaint);

        // 2. Audit Trail Logging
        await TicketHistory.create({
            ticketId: savedComplaint._id,
            action: 'Created',
            changedBy: user,
            details: `Ticket "${title}" was created in category ${category}.`
        });

        // 3. Email Notification
        const foundUser = await User.findById(user);
        if (foundUser) {
            await sendEmail(
                foundUser.email,
                'Ticket Submitted Successfully',
                `Hello ${foundUser.name},\n\nWe have received your ticket: "${title}". Our team will review it shortly.\n\nThank you!`
            );
        }

        // 4. Send EXACTLY ONE Response
        return res.status(201).json(savedComplaint);
    } catch (err) {
        console.error("CREATE COMPLAINT ERROR:", err);
        return res.status(500).json({ message: 'Error creating complaint', error: err.message });
    }
});

// @route   GET /api/complaints
router.get('/', async (req, res) => {
    try {
        const complaints = await Complaint.find().populate('user', 'name email').sort({ createdAt: -1 });
        return res.status(200).json(complaints);
    } catch (err) {
        return res.status(500).json({ message: 'Error fetching complaints', error: err.message });
    }
});

// @route   PUT /api/complaints/:id
router.put('/:id', async (req, res) => {
    try {
        const { status, adminId } = req.body;

        const updatedComplaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            { status },
            { returnDocument: 'after' }
        ).populate('user', 'name email');

        if (!updatedComplaint) return res.status(404).json({ message: 'Complaint not found' });

        // 1. WebSocket Broadcast
        const io = req.app.get('io');
        if (io) io.emit('ticketStatusChanged', updatedComplaint);

        // 2. Audit Trail Logging
        // Safely determine who made the change (the Admin, or fallback to the student)
        const changedById = adminId || (updatedComplaint.user ? updatedComplaint.user._id : null);
        if (changedById) {
            await TicketHistory.create({
                ticketId: updatedComplaint._id,
                action: 'Status Changed',
                changedBy: changedById,
                details: `Status was changed to: ${status}.`
            });
        }

        // 3. Email Notification
        if (updatedComplaint.user) {
            await sendEmail(
                updatedComplaint.user.email,
                'Ticket Status Updated',
                `Hello ${updatedComplaint.user.name},\n\nYour ticket "${updatedComplaint.title}" is now marked as: ${status}.`
            );
        }

        // 4. Send EXACTLY ONE Response
        return res.status(200).json(updatedComplaint);
    } catch (err) {
        return res.status(500).json({ message: 'Error updating complaint', error: err.message });
    }
});

// @route   DELETE /api/complaints/:id
router.delete('/:id', async (req, res) => {
    try {
        const deletedComplaint = await Complaint.findByIdAndDelete(req.params.id);

        if (!deletedComplaint) return res.status(404).json({ message: 'Complaint not found' });

        // 1. WebSocket Broadcast
        const io = req.app.get('io');
        if (io) io.emit('ticketDeleted', req.params.id);

        // 2. Audit Trail Logging
        const changedById = req.body.adminId || (deletedComplaint.user ? deletedComplaint.user : null);
        if (changedById) {
            await TicketHistory.create({
                ticketId: deletedComplaint._id,
                action: 'Deleted',
                changedBy: changedById,
                details: `Ticket "${deletedComplaint.title}" was permanently deleted.`
            });
        }

        // 3. Send EXACTLY ONE Response
        return res.status(200).json({ message: 'Complaint deleted successfully' });
    } catch (err) {
        return res.status(500).json({ message: 'Error deleting complaint', error: err.message });
    }
});

// @route   GET /api/complaints/:id/history
router.get('/:id/history', async (req, res) => {
    try {
        const history = await TicketHistory.find({ ticketId: req.params.id })
            .populate('changedBy', 'name role')
            .sort({ createdAt: -1 });

        return res.status(200).json(history);
    } catch (err) {
        return res.status(500).json({ message: 'Error fetching audit trail', error: err.message });
    }
});

module.exports = router;