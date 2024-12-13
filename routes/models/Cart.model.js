const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
   userid: {
       type: Schema.ObjectId,
       required: true,
       unique: true
   },
    products: {
       type: [Schema.ObjectId]
    }
});

module.exports = mongoose.model('Cart', cartSchema);
