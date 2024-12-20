const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
   userid: {
       type: Schema.ObjectId,
       required: true,
       unique: true
   },
    products: {
       // A map pairing productIds to the # of products in cart
       type: Map,
        required: true
    }
});

module.exports = mongoose.model('Cart', cartSchema);
