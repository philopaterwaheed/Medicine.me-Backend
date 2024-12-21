const Product = require('./models/Product.model.js');

const router = require('express').Router();

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({});
        if (!products) {
            return res.status(404).json({error: 'not found: no products found'});
        }
        res.status(200).json(products);

    } catch (error) {
        res.status(500).json({error: error.message});
    }
});
// get product by id DONE
router.get('/:productId', async (req, res) => {
	try {
		const productId = req.params.productId;
		const product = await Product.findById( productId );
		if (!product) {
			return res.status(404).json({ error: `No reviews found for product with id ${productId}` });
		}
		res.status(200).json(product);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});
// Get products in specific category
router.get('/:category', async (req, res) => {
    try {
        const category = req.params.category;
        const products = await Product.find({category: category});

        if (!products) {
            return res.status(404).json({error: `not found: no products found in category ${category}.`});
        }
        res.status(200).json(products);

    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// Delete product by id
router.delete('/:id', async (req, res) => {
   try {
       const productId = req.params.id;
       const product = await Product.findByIdAndDelete(productId);

       if (!product) {
           return res.status(404).json({error: `not found: no products with id ${productId} were found.`})
       }
       res.status(200).json(product);

   } catch (error) {
       res.status(500).json({error: error.message});
   }
});

// Create product
router.post('/add', async (req, res) => {
    try {
        let productParams = req.body;

        // If product already exists
        if (await Product.findOne({name: productParams.name})) {
            return res.status(409).json({error: `conflict: Product with name ${productParams.name} already exists`});
        }

        // Create new product & save it
        const product = new Product(productParams);

        await product.save();

        return res.status(200).json({message: "Product added successfully!"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// Edit product
router.put('/edit/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const changes = req.body;
        const product = await Product.findByIdAndUpdate(productId, changes, {new: true});

        if (!product) {
            return res.status(404).json({error: `not found: product with id ${productId} was not found`});
        }

        res.status(200).json({message: 'Product updated successfully!'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// Search by
router.get('/search/:keyword', async (req, res) => {
    try {
        const keyword = req.params.keyword;

        const regex = new RegExp(keyword, "i");

        const products = await Product.find({name: regex});

        // Check if no products are found
        if (!products || products.length === 0) {
            return res.status(404).json({error: `not found: ${keyword} wasn't found.`});
        }

        // Send the found products
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

module.exports = router;
