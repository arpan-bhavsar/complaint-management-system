const mongoose = require('mongoose');

const TicketHistorySchema = new mongoose.Schema({
    ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', required: true },
    action: { type: String, required: true }, // e.g., 'Created', 'Status Changed', 'Deleted'
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    details: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('TicketHistory', TicketHistorySchema);