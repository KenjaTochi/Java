const fs = require('fs');
const path = require('path');
const ApplicationModel = require('../application/applicationModel');

class ApplicationController
{
    constructor(req)
    {
        this.req = req;
        this.data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'applicationData.json')));
        this.model = new ApplicationModel();
    }

    getMainPage(req, res)
    {
        const query = req.query;
        const filter = query.filter;
        const search = query.search;

        let result = this.model.getAllProducts();
        let filteredData = result.products;
        let filters = result.filters;
        let resultsText = '';

        if (filter && !search)
        {
            result = this.model.getProductsByFilter(filter);
            filteredData = result.products;
            filters = result.filters;
            resultsText = `${filteredData.length} results shown for filter "${filter}"`;
        }
        else if (search && !filter)
        {
            result = this.model.getProductsBySearch(search);
            filteredData = result.products;
            filters = result.filters;
            resultsText = `${filteredData.length} results shown for search text "${search}"`;
        }
        else
        {
            resultsText = `${filteredData.length} results shown`;
        }

        const tagMap = {};
        filters.forEach(f => tagMap[f.name] = f.count);

        let filtersHtml = '<div><a href="/application">No Filters</a></div><br>';
        for (let tag in tagMap)
        {
            filtersHtml += `<div><a href="/application?filter=${tag}">${tag}</a> (${tagMap[tag]})</div>`;
        }

        const cardTemplate =
            `<div class="card">
                <div class="cardimage"> </div>
                <img class="cardimage" src="{imagesource}" />
                <div class="cardtitle"><a href="/application/product/{id}">{name}</a></div>
                <div class="carddesc">{shortdesc}</div>
            </div>`;

        let cards = '';
        filteredData.forEach(item =>
        {
            let card = cardTemplate;
            card = card.replace('{id}', item.id);
            card = card.replace('{name}', item.name);
            card = card.replace('{shortdesc}', item.shortdesc);
            card = card.replace('{imagesource}', item.imagesource);
            cards += card;
        });

        const templatePath = path.join(__dirname, '../application/template/main.template');
        let template = fs.readFileSync(templatePath).toString();
        template = template.replace('{{cards}}', cards);
        template = template.replace('{{resultsCount}}', resultsText);
        template = template.replace('{{filters}}', filtersHtml);

        res.send(template);
    }

    getProductPage(req, res)
    {
        const productId = req.params.id;
        const product = this.model.getProductById(productId);

        if (!product)
        {
            res.send('<h1>Product not found</h1>');
            return;
        }

        const currentIndex = this.data.findIndex(p => String(p.id) === String(productId));
        const nextIndex = (currentIndex + 1) % this.data.length;
        const nextProductId = this.data[nextIndex].id;

        const contentTemplate =
            `<div class="contentleft">
                <img class="contentimage" src="{imagesource}">
            </div>
            <div class="contentright">
                <div><b>{longname}</b></div><br>
                <div class="price">{price}</div>
                <button id="add-to-cart-button" data-product-id="{id}">Add to Cart</button>
                <div><br>{longdesc}</div>
                <div class="tags">Tags: {tags}</div>
            </div>`;

        let content = contentTemplate;
        content = content.replace('{imagesource}', product.imagesource);
        content = content.replace('{longname}', product.longname);
        content = content.replace('{price}', product.price);
        content = content.replace('{longdesc}', product.longdesc);
        content = content.replace('{tags}', product.tags);
        content = content.replace('{id}', product.id);

        content += `
            <br>
            <div class="nav-links" style="margin-top: 20px;">
                <a href="/application">Back to Main Page</a><br>
                <a href="/application/product/${nextProductId}">Next Product &raquo;</a>
            </div>`;

        const templatePath = path.join(__dirname, '../application/template/product.template');
        let template = fs.readFileSync(templatePath).toString();
        template = template.replace('{{contentgrid}}', content);

        res.send(template);
    }

    getProductsJson(query)
    {
        if (query.id)
        {
            const product = this.getProductByIdJson(query.id);
            return product ? product : { error: 'Product not found' };
        }

        let filteredData = this.data;
        const filter = query.filter;
        const search = query.search;

        if (filter && !search)
        {
            filteredData = this.data.filter(p =>
                p.tags.split(',').map(t => t.trim()).includes(filter)
            );
        }
        else if (search && !filter)
        {
            const s = search.toLowerCase();
            filteredData = this.data.filter(p =>
                p.name.toLowerCase().includes(s) ||
                p.shortdesc.toLowerCase().includes(s) ||
                p.longname.toLowerCase().includes(s) ||
                p.longdesc.toLowerCase().includes(s) ||
                p.tags.toLowerCase().includes(s)
            );
        }

        let allTags = [];
        this.data.forEach(item =>
        {
            let tags = item.tags.split(',').map(tag => tag.trim());
            tags.forEach(tag =>
            {
                if (!allTags.some(t => t.name === tag))
                {
                    let count = this.data.filter(d =>
                        d.tags.toLowerCase().includes(tag.toLowerCase())
                    ).length;

                    allTags.push({ name: tag, count: count });
                }
            });
        });

        return {
            products: filteredData,
            filters: allTags
        };
    }

    getProductByIdJson(id)
    {
        return this.data.find(p => String(p.id) === String(id));
    }
}

module.exports = ApplicationController;
