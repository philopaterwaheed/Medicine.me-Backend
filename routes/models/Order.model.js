const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    products: {
        // A map pairing productIds to the # of products in cart
        type: Map,
        required: true
    },
    userId: {
        type: Schema.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum: ['Confirmed', 'Delivered', 'Cancelled']
    },
});

module.exports = mongoose.model('Order', OrderSchema);

