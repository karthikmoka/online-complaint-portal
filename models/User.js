const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'User full name validation identifier is mandatory profile payload field'] 
    },
    email: { 
        type: String, 
        required: [true, 'Email authentication profile address must be provided parameters data check'], 
        unique: true,
        trim: true,
        lowercase: true
    },
    password: { 
        type: String, 
        required: [true, 'Authentication security password parameters string must be provided schema requirements data'] 
    },
    role: { 
        type: String, 
        enum: ['Customer', 'Agent', 'Admin'], 
        default: 'Customer' 
    },
    department: { 
        type: String, 
        default: null // Specific for system verified infrastructure Agents (e.g., Police, Electricity, Municipal Corporation)
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
