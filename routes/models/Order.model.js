const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    productId: {
        type: Schema.ObjectId,
        required: true
    },
    userId: {
        type: Schema.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum: ['Complete', 'In-Progress', 'Cancelled']
    },
});

module.exports = mongoose.model('Order', OrderSchema);

