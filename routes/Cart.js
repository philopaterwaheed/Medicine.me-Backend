const Cart = require('./models/Cart.model.js');

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
        const cart = await Cart.findOne({userId: userId});

        const products = cart.get('products');
        products.push(productId);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// Remove product from cart
router.delete('/remove/:productId/:userId', async (req, res) => {
   try {
       const { productId, userId } = req.params;
       const cart = await Cart.findOne({userId: userId});

       cart.products = cart.products.filter(
           product => product.productId.toString() !== productId
       );

      cart.save();
   } catch (error) {
       res.status(500).json({error: error.message});
   }
});

// TODO: Create order route
