const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
	userId: {
		type: Schema.ObjectId,
		required: true,
		unique: true,
	},
	productId: {
		type: Schema.ObjectId,
		required: true
	},
	header: {
		type: String,
		required: true
	},
	body: {
		type: String,
		required: true
	},
	purchased: {
		type: Boolean,
		required: true
	},
	stars: {
		type: Number,
		max: 5,
		min: 0,
		required: true
	}
});

module.exports = mongoose.model('Review', ReviewSchema);

