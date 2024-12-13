const Product = require('./models/Product.model.js');
const Reviews = require("../routes/models/Review.model");

const router = require('express').Router();

function getAverage(array) {
	if (array.length === 0) return 0; // Handle empty array
	const sum = array.reduce((acc, num) => acc + num, 0); // Calculate the sum
	return sum / array.length; // Divide by the length of the array
}
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

		//todo: delete review from product and update rating
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
			let reviews = await Reviews.find({ productId: product._id });
			product.rating = getAverage(reviews.map(review => review.stars));
			await product.save();
		}
		return res.status(200).json({ message: "review added successfully!" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});
module.exports = router;

//675c3feb5c9ec0344abb547f
