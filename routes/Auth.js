const router = require("express").Router();
const User = require("../routes/models/User.model");
const Cart = require("../routes/models/Cart.model");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
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

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json("Wrong User Email");
        }

        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json("Wrong Password");
        }

        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.admin,
            },
            process.env.JWT_SEC,
            { expiresIn: "3d" }
        );

        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken });

    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
