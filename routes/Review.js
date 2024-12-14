const Product = require('./models/Product.model.js');
const Reviews = require("../routes/models/Review.model");

const router = require('express').Router();

// Get all Reviews
//
router.get('/', async (req, res) => {
	try {
		const reviews = await Reviews.find({});
		if (!reviews) {
			return res.status(404).json({ error: 'not found: no products found' });
		}
		res.status(200).json(reviews);

	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Delete Review by id
router.delete('/:id', async (req, res) => {
	try {
		const reviewId = req.params.id;
		const review = await Reviews.findByIdAndDelete(reviewId);

		if (!review) {
			return res.status(404).json({ error: `not found: no products with id ${reviewId} were found.` })
		}
		res.status(200).json(review);

		const product = await Product.findById(reviewParams.productId);
		if (product) {
			product.reviews = product.reviews.filter(id => id !== reviewId);
			let rate = product.rating;
			product.reviewsCount = product.reviewsCount >= 1 ? product.reviewsCount - 1 : 0;
			product.rating = rate - review.stars / product.reviewsCount;
			await product.save();
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Create review
router.post('/add', async (req, res) => {
	if (!req.body) {
		return res.status(400).json({ error: 'bad request: no data found in request body' });
	}
	try {
		let reviewParams = req.body;

		// If product already exists
		if (await Reviews.findById(reviewParams.id) || await Reviews.findOne({ userId: reviewParams.userId })) {
			return res.status(409).json({ error: `conflict: already exists a review` });
		}

		// Create new product & save it
		const review = new Reviews(reviewParams);

		await review.save();

		const product = await Product.findById(reviewParams.productId);
		if (product) {
			product.reviews.push(review._id);
			let reate = product.rating;
			product.reviewsCount = product.reviewsCount + 1;
			product.rating = reate + review.stars / product.reviewsCount;
			await product.save();
		}
		return res.status(200).json({ message: "review added successfully!" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});
module.exports = router;

//675c3feb5c9ec0344abb547f
