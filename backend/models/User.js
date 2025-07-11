const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is Required']
    },
    email: {
        type: String,
        required: [true, 'Name is Required'],
        unique: [true, 'email already exist']
    },
    password: {
        type: String,
        required: [true, 'Password Required'],
        minLength: [8, "password must contain 8 charecters"],
        maxLength: [128, "password must lessthan 128 charecters"]
    },
    phone: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        enum: ['customer', 'host', 'admin'],
        default: 'customer'
    },

    licenseNumber: {
        type: String,
    },
    addressProofId: {
        type: String,
    },
    profilepic: {
        type: String,

    },
    licenseProof: {
        type: String
    },

    addressProof: {
        type: String
    },
    verified: {
        type: Boolean,
        default: false,
    },

},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        timestamps: true
    })
userSchema.virtual('vehicles', {
    ref: 'Vehicle',
    localField: '_id',
    foreignField: 'ownerId'
})
userSchema.pre('validate', function (next) {
    if (this.role === 'customer' && !this.licenseNumber) {
        this.invalidate('licenseNumber', 'License number is required for customers');
    }
    next();
});
const User = mongoose.model('User', userSchema);

module.exports = User;