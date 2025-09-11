const fs = require('fs');
const path = require('path');

class ApplicationModel
{
    constructor()
    {
        this.initialize();
    }

    initialize()
    {
        this.products = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'applicationData.json'), 'utf8'));

        this.filters = [];

        let allTags = [];

        this.products.forEach(item =>
        {
            let tags = item.tags.split(',').map(tag => tag.trim());
            tags.forEach(tag =>
            {
                if (!allTags.some(t => t.name === tag))
                {
                    let count = this.products.filter(d =>
                        d.tags.toLowerCase().includes(tag.toLowerCase())
                    ).length;

                    allTags.push({ name: tag, count: count });
                }
            });
        });

        this.filters = allTags;
    }

    getAllProducts()
    {
        return {
            products: this.products,
            filters: this.filters
        };
    }

    getProductById(id)
    {
        let product = this.products.find(p => String(p.id) === String(id));
        return product || null;
    }

    getProductsByFilter(filter)
    {
        let filteredProducts = this.products.filter(item =>
            item.tags.toLowerCase().includes(filter.toLowerCase())
        );

        return {
            products: filteredProducts,
            filters: this.filters
        };
    }

    getProductsBySearch(searchText)
    {
        const lowerSearch = searchText.toLowerCase();

        let filteredProducts = this.products.filter(item =>
        {
            if (item.name.toLowerCase().includes(lowerSearch)) return true;
            if (item.longname.toLowerCase().includes(lowerSearch)) return true;
            if (item.shortdesc.toLowerCase().includes(lowerSearch)) return true;
            if (item.longdesc.toLowerCase().includes(lowerSearch)) return true;
            if (item.tags.toLowerCase().includes(lowerSearch)) return true;
            return false;
        });

        return {
            products: filteredProducts,
            filters: this.filters
        };
    }
}

module.exports = ApplicationModel;
