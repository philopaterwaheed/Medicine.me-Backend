const router = require("express").Router();
const User = require("../routes/models/User.model");
const Cart = require("../routes/models/Cart.model");
const bcrypt = require('bcryptjs');
//REGISTER
router.post("/register", async (req, res) => {

	if (req.body.password && req.body.email && req.body.username && req.body.address && req.body.phoneNumber) {
		const { email } = req.params;
		const user = await User.findOne({ email });
		user && res.status(400).json("User with this email already exists");
		const password = await bcrypt.hash(req.body.password,10);
		const newUser = new User({
			username: req.body.username,
			email: req.body.email,
			password: password,
			address: req.body.address,
			phoneNumber: req.body.phoneNumber,
		});

		const cart = new Cart({userId: newUser._id, products: []});
		newUser.cartId = cart._id;
		try {
			const savedUser = await newUser.save();
			res.status(201).json(savedUser);
		} catch (err) {
			res.status(500).json(err);
		}
	}
	else
		return res.status(400).json("Please fill all the fields");
});

//LOGIN


module.exports = router;
