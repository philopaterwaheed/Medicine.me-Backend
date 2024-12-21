const Cart = require('./models/Cart.model.js');
const mongoose = require("mongoose");

const router = require('express').Router();

// Get products in cart using user id
router.get('/:userId', async (req, res) => {
   try {
       const userId = req.params.userId;
       const cart = await Cart.findOne({userId: userId});
       res.status(200).json({cart: cart.get('products')});
   } catch (error) {
       res.status(500).json({error: error.message});
   }
});

// Add product to cart
router.put('/add/:productId/:userId', async (req, res) => {
    try {
        const { productId, userId } = req.params;
        let cart = await Cart.findOne({userId: userId});

        // Get current count of product if any
        const currentCount = cart.products.get(productId) || 0;
        cart.products.set(productId, currentCount + 1);

        await cart.save();
        return res.status(200).json({message: `Product with id: ${productId} added to cart!`});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// Remove product from cart
router.delete('/remove/:productId/:userId', async (req, res) => {
    try {
        const { productId, userId } = req.params;
        let cart = await Cart.findOne({userId: userId});

        // Get current count of product if any
        const currentCount = cart.products.get(productId);

        if (!currentCount) {
            return res.status(401).json({error: `conflict: product with id ${productId} is not in cart`});
        }

        // Remove the product from cart
        cart.products.set(productId, currentCount - 1);
        if (cart.products.get(productId) === 0) cart.products.remove(productId);

        await cart.save();
        return res.status(200).json({message: `Product with id: ${productId} removed from cart!`});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
})

module.exports = router;

