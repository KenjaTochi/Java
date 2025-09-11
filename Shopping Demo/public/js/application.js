class PageModel
{
    constructor()
    {
        this.currentView = 'main';
        this.currentFilter = null;
        this.currentSearch = null;
    }

    getProducts(callback)
    {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/product', true);
        xhr.onreadystatechange = function ()
        {
            if (xhr.readyState === 4 && xhr.status === 200)
            {
                const data = JSON.parse(xhr.responseText);
                callback(
                {
                    products: data.products,
                    filters: data.filters
                });
            }
        };
        xhr.send();
    }

    getProductsByFilter(filter, callback)
    {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/product?filter=${encodeURIComponent(filter)}`, true);
        xhr.onreadystatechange = function ()
        {
            if (xhr.readyState === 4 && xhr.status === 200)
            {
                const data = JSON.parse(xhr.responseText);
                callback(
                {
                    products: data.products,
                    filters: data.filters
                });
            }
        };
        xhr.send();
    }

    getProductsBySearch(search, callback)
    {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/product?search=${encodeURIComponent(search)}`, true);
        xhr.onreadystatechange = function ()
        {
            if (xhr.readyState === 4 && xhr.status === 200)
            {
                const data = JSON.parse(xhr.responseText);
                callback(
                {
                    products: data.products,
                    filters: data.filters
                });
            }
        };
        xhr.send();
    }
}

class PageView
{
    constructor()
    {
        this.contentArea = document.getElementById('contentArea');
        this.resultsCount = document.getElementById('resultsCount');
        this.filterSection = document.getElementById('filterSection');
        this.searchInput = document.getElementById('searchInput');
    }

    createMainPage(data)
    {
        const products = data.products;
        const filters = data.filters;

        this.resultsCount.textContent = `${products.length} products shown`;
        this.createFilters(filters);

        let cardsHtml = '<div class="cardgrid">';
        products.forEach((product) =>
        {
            cardsHtml +=
                `<div class="card" onclick="app.showProduct('${product.id}')">
                    <img class="cardimage" src="${product.imagesource}" alt="${product.name}" />
                    <div class="cardtitle">${product.name}</div>
                    <div class="carddesc">${product.shortdesc}</div>
                </div>`;
        });
        cardsHtml += '</div>';

        this.contentArea.innerHTML = cardsHtml;
    }

    createProductPage(product)
    {
        this.filterSection.innerHTML = 
            `<br><br>
             <div><a href="#" class="nav-link back-link" onclick="event.preventDefault(); app.showMainPage()">Back to Main Page</a></div>`;

        this.resultsCount.textContent = '';

        const productHtml =
            `<div class="contentgrid">
                <div class="contentleft">
                    <img class="contentimage" src="${product.imagesource}" alt="${product.longname}" />
                </div>
                <div class="contentright">
                    <div class="cardtitle"><u>${product.longname}</u></div>
                    <div class="price"><b>${product.price}</b></div>
                    <div><p><br>${product.longdesc}</p></div>
                    <button class="add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
                    <div class="tags">tags: ${product.tags}</div>
                </div>
            </div>`;

        this.contentArea.innerHTML = productHtml;

        const addToCartButton = document.querySelector('.add-to-cart-btn');
        addToCartButton.addEventListener('click', function ()
        {
            const productId = this.getAttribute('data-product-id');
            addProductToCart(productId, 1);
        });
    }

    createFilters(filters)
    {
        let filtersHtml = '';

        if (app.pageModel.currentFilter)
        {
            filtersHtml += `<div><a href="#" class="filter-link remove-filter" onclick="app.removeFilter()">Remove Filter</a></div><br/>`;
        }

        filters.forEach(filter =>
        {
            filtersHtml += `<div><a href="#" class="filter-link" onclick="app.applyFilter('${filter.name}')">${filter.name}</a> (${filter.count})</div>`;
        });

        this.filterSection.innerHTML = filtersHtml;
    }

    updateResultsCount(count, filter, search)
    {
        if (search)
        {
            this.resultsCount.textContent = `${count} results shown for search text "${search}"`;
        }
        else if (filter)
        {
            this.resultsCount.textContent = `${count} results shown for filter "${filter}"`;
        }
        else
        {
            this.resultsCount.textContent = `${count} products shown`;
        }
    }
}

class PageController
{
    constructor(pageModel, pageView)
    {
        this.pageModel = pageModel;
        this.pageView = pageView;

        this.createMainPage();

        this.pageView.searchInput.addEventListener('keydown', (e) =>
        {
            if (e.key === 'Enter')
            {
                this.performSearch();
            }
        });
    }

    createMainPage()
    {
        this.pageModel.currentView = 'main';
        this.pageModel.currentFilter = null;
        this.pageModel.currentSearch = null;
        this.pageView.searchInput.value = '';

        this.pageModel.getProducts((data) =>
        {
            this.products = data.products;
            this.pageView.createMainPage(data);
            this.pageView.updateResultsCount(data.products.length, null, null);
        });
    }

    showProduct(id)
    {
        this.pageModel.currentView = 'product';

        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/product/${id}/json`, true);
        xhr.onreadystatechange = () =>
        {
            if (xhr.readyState === 4 && xhr.status === 200)
            {
                const product = JSON.parse(xhr.responseText);
                this.pageView.createProductPage(product);
            }
        };
        xhr.send();
    }

    showMainPage()
    {
        this.createMainPage();
    }

    applyFilter(filter)
    {
        this.pageModel.currentFilter = filter;
        this.pageModel.currentSearch = null;
        this.pageView.searchInput.value = '';

        this.pageModel.getProductsByFilter(filter, (data) =>
        {
            this.products = data.products;
            this.pageView.createMainPage(data);
            this.pageView.updateResultsCount(data.products.length, filter, null);
        });
    }

    removeFilter()
    {
        this.pageModel.currentFilter = null;
        this.createMainPage();
    }

    performSearch()
    {
        const searchText = this.pageView.searchInput.value.trim();

        if (!searchText)
        {
            return;
        }

        this.pageModel.currentSearch = searchText;
        this.pageModel.currentFilter = null;

        this.pageModel.getProductsBySearch(searchText, (data) =>
        {
            this.products = data.products;
            this.pageView.createMainPage(data);
            this.pageView.updateResultsCount(data.products.length, null, searchText);
        });
    }
}

const app = new PageController(new PageModel(), new PageView());
