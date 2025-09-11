const express = require('express');
const router = express.Router();

const CartModel = require('../application/cart');
const ApplicationModel = require('../application/applicationModel');

const cartModel = new CartModel();
const appModel = new ApplicationModel();

router.get('/', (req, res) => 
{
    res.json(
    {
        items: cartModel.getCart(),
        total: cartModel.getTotal()
    });
});

router.post('/', (req, res) => 
{
    const { id } = req.body;

    if (!id)
    {
        return res.status(400).json({ error: 'Product id required' });
    }

    const product = appModel.getProductById(id);

    if (!product)
    {
        return res.status(404).json({ error: 'Product not found' });
    }

    const added = cartModel.addToCart(product);

    if (!added)
    {
        return res.status(409).json({ error: 'Product already in cart' });
    }

    res.status(201).json({ message: 'Product added', product });
});

router.put('/:id', (req, res) => 
{
    const productId = req.params.id;
    const { quantity } = req.body;

    if (quantity === undefined)
    {
        return res.status(400).json({ error: 'Product quantity is required' });
    }

    const updated = cartModel.updateQuantity(productId, quantity);

    if (!updated)
    {
        return res.status(404).json({ error: 'Product not found in cart' });
    }

    res.json({ message: 'Quantity updated' });
});

router.delete('/:id', (req, res) => 
{
    const productId = req.params.id;
    const removed = cartModel.removeFromCart(productId);

    if (!removed)
    {
        return res.status(404).json({ error: 'Product not found in cart' });
    }

    res.json({ message: 'Product removed' });
});

module.exports = router;
