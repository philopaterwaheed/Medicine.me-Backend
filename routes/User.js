const Users = require('./models/User.model.js');
const Reviews = require("../routes/models/Review.model");

const router = require('express').Router();

// Get a User by ID
router.get('/users/:id', async (req, res) => {
	try {
		const userId = req.params.id;
		const user = await Users.findById(userId);

		if (!user) {
			return res.status(404).json({ error: `User with id ${userId} not found` });
		}

		res.status(200).json(user);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Get All Users
router.get('/users', async (req, res) => {
	try {
		const { admin } = req.query;
		const query = admin !== undefined ? { admin: admin === 'true' } : {};

		const users = await Users.find(query);
		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

// Update a User
router.put('/users/:id', async (req, res) => {
	try {
		const userId = req.params.id;
		const updates = req.body;

		// Update the user and return the new document
		const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });

		if (!updatedUser) {
			return res.status(404).json({ error: `User with id ${userId} not found` });
		}

		res.status(200).json({ message: 'User updated successfully', user: updatedUser });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

module.exports = router;

