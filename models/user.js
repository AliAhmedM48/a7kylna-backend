const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    fullName: { type: String, trim: true, required: [true, 'name required'] },
    password: { type: String, required: [true, 'password required'], trim: true },
    avatar: { type: String }, // Assuming avatar will be stored as a URL
    email: { type: String, required: true, unique: true },
    gender: { type: String, enum: ['male', 'female'], default: 'male' } // Corrected default value
},
    { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;
