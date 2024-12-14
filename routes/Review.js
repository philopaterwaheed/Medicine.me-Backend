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
			if (product.reviewsCount === 0) {
				product.rating = 0;
			}
			else {
				product.rating = rate - review.stars / product.reviewsCount;
			}
			await product.save();
		}
		else {
			return res.status(404).json({ error: `Not found: product with id ${review.productId} was not found` });
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
			return res.status(200).json({ message: "review added successfully!" });
		}
		else {
			return res.status(404).json({ error: `Not found: product with id ${review.productId} was not found` });
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});
// Edit Review
router.put('/edit/:id', async (req, res) => {
	try {
		const reviewId = req.params.id;
		const changes = req.body;
		const review = await Reviews.findById(reviewId);
		if (!review) {
			return res.status(404).json({ error: `Not found: review with id ${reviewId} was not found` });
		}
		const product = await Product.findById(review.productId);
		if (!product) {
			return res.status(404).json({ error: `Not found: product with id ${review.productId} was not found` });
		}
		const oldStars = review.stars;
		const newStars = changes.stars || oldStars;
		const reviewsCount = product.reviewsCount;
		if (reviewsCount > 0) {
			product.rating =
				((product.rating * reviewsCount) - oldStars + newStars) / reviewsCount;
		}
		await Reviews.findByIdAndUpdate(reviewId, changes, { new: true });
		await product.save();
		res.status(200).json({ message: 'Review updated successfully!' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});
// Search Reviews by User ID
router.get('/users/:userId', async (req, res) => {
	try {
		const userId = req.params.userId;
		const reviews = await Reviews.find({ userId });
		if (reviews.length === 0) {
			return res.status(404).json({ error: `No reviews found for user with id ${userId}` });
		}
		res.status(200).json(reviews);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get('/products/:productId', async (req, res) => {
	try {
		const productId = req.params.productId;
		const reviews = await Reviews.find({ productId });
		if (reviews.length === 0) {
			return res.status(404).json({ error: `No reviews found for product with id ${productId}` });
		}
		res.status(200).json(reviews);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});
//
// Get Top-Rated Products
router.get('/products/top-rated', async (req, res) => {
	try {
		const topProducts = await Product.find({ reviewsCount: { $gt: 0 } })
			.sort({ rating: -1 })
			.limit(10);

		res.status(200).json(topProducts);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});
module.exports = router;

//675c3feb5c9ec0344abb547f
