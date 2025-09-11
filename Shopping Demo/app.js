const express = require('express');
const path = require('path');

const applicationRouter = require('./routes/application');
const publicRouter = require('./routes/public');
const cartRouter = require('./routes/cart');

const app = express();

app.use(express.json());
app.use('/api/cart', cartRouter);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', applicationRouter);
app.use('/', publicRouter);

const PORT = 3050;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

module.exports = app;

