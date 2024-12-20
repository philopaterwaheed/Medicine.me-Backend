const Order = require('./models/Order.model.js');
const Cart = require('./models/Cart.model.js');

const router = require('express').Router();
// Used for accessing, making, and cancelling orders

// Get all orders
router.get('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const orders = await Order.find({ userId: userId });

        if (!orders) {
            return res.status(404).json({error: 'not found: no orders yet!'});
        }

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new order
router.post('/add/:userId', async (req, res) => {
   try {
       const userId = req.params.userId;
       let orderParams = Cart.find({ userId: userId });

       orderParams.status = 'Confirmed';
       const order = new Order(orderParams);

       await order.save();

       res.status(200).json({message: "Order created successfully!"});

       setTimeout(async () => {
           if (order.status === 'Confirmed') {
               order.status = 'Delivered';
               await order.save();
           }
       }, 30000);

   } catch (error) {
       res.status(500).json({ error: error.message });
   }
});

// Cancel order
router.put('/cancel/:orderId', async (req, res) => {
    try {
        const orderId = req.params.orderId;
        let order = Order.find({ id: orderId });

        if (!order) return res.status(404).json({error: `not found: orderId ${orderId} couldn't be found`});

        order.status = 'Cancelled';
        await order.save();
        res.status(200).json({ message: `Order ${orderId} cancelled successfully.`});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})
module.exports = router;
