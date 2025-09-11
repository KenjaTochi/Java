const express = require('express');
const router = express.Router();
const path = require('path');
const ApplicationController = require('../application/applicationController');

const controller = new ApplicationController();

router.get('/', (req, res) => 
{
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

router.get('/product/:id', (req, res) => 
{
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

router.get('/product', (req, res) => 
{
    const data = controller.getProductsJson(req.query);
    res.json(data);
});

router.get('/product/:id/json', (req, res) => 
{
    const product = controller.getProductByIdJson(req.params.id);

    if (product)
    {
        res.json(product);
    }
    else
    {
        res.status(404).json({ error: 'Product not found' });
    }
});

module.exports = router;
