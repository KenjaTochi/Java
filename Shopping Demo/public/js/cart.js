function renderCart(cartData)
{
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalContainer = document.getElementById('cart-total');

    if (!cartItemsContainer || !cartTotalContainer)
    {
        return;
    }

    cartItemsContainer.innerHTML = '';

    if (!cartData.items || cartData.items.length === 0)
    {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        cartTotalContainer.textContent = '';
        return;
    }

    const ul = document.createElement('ul');
    ul.classList.add('cart-list');

    cartData.items.forEach(item =>
    {
        const li = document.createElement('li');
        li.classList.add('cart-item');

        const nameDiv = document.createElement('div');
        nameDiv.textContent = item.name;
        nameDiv.classList.add('item-name');
        li.appendChild(nameDiv);

        const qtyContainer = document.createElement('div');
        qtyContainer.classList.add('qty-container');

        const minusBtn = document.createElement('button');
        minusBtn.textContent = '-';
        minusBtn.classList.add('qty-btn');
        minusBtn.onclick = () =>
        {
            if (item.quantity > 1)
            {
                updateCartQuantity(item.id, item.quantity - 1);
            }
        };

        const qtyDisplay = document.createElement('span');
        qtyDisplay.textContent = item.quantity;
        qtyDisplay.classList.add('qty-display');

        const plusBtn = document.createElement('button');
        plusBtn.textContent = '+';
        plusBtn.classList.add('qty-btn');
        plusBtn.onclick = () =>
        {
            updateCartQuantity(item.id, item.quantity + 1);
        };

        const priceSpan = document.createElement('span');
        priceSpan.textContent = `$${item.price.toFixed(2)}`;
        priceSpan.classList.add('item-price');

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.classList.add('remove-btn');
        removeBtn.onclick = () =>
        {
            removeProductFromCart(item.id);
        };

        qtyContainer.appendChild(minusBtn);
        qtyContainer.appendChild(qtyDisplay);
        qtyContainer.appendChild(plusBtn);
        qtyContainer.appendChild(priceSpan);

        li.appendChild(qtyContainer);

        const removeContainer = document.createElement('div');
        removeContainer.classList.add('remove-container');
        removeContainer.appendChild(removeBtn);
        li.appendChild(removeContainer);

        const lineTotal = document.createElement('div');
        lineTotal.textContent = `Total: $${(item.price * item.quantity).toFixed(2)}`;
        lineTotal.classList.add('line-total');
        li.appendChild(lineTotal);

        ul.appendChild(li);
    });

    cartItemsContainer.appendChild(ul);

    cartTotalContainer.textContent = `Total: $${cartData.total.toFixed(2)}`;
}

function loadCart()
{
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/cart', true);
    xhr.onreadystatechange = function ()
    {
        if (xhr.readyState === 4)
        {
            if (xhr.status === 200)
            {
                const data = JSON.parse(xhr.responseText);
                renderCart(data);
            }
            else
            {
                console.error('Load cart error:', xhr.statusText);
            }
        }
    };
    xhr.send();
}

function addProductToCart(productId)
{
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/cart', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function ()
    {
        if (xhr.readyState === 4)
        {
            if (xhr.status === 201 || xhr.status === 409)
            {
                loadCart();
            }
            else
            {
                console.error('Add product error:', xhr.statusText);
            }
        }
    };
    xhr.send(JSON.stringify({ id: productId }));
}

function updateCartQuantity(productId, quantity)
{
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', `/api/cart/${productId}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function ()
    {
        if (xhr.readyState === 4)
        {
            if (xhr.status === 200)
            {
                loadCart();
            }
            else
            {
                console.error('Update quantity error:', xhr.statusText);
            }
        }
    };
    xhr.send(JSON.stringify({ quantity }));
}

function removeProductFromCart(productId)
{
    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', `/api/cart/${productId}`, true);
    xhr.onreadystatechange = function ()
    {
        if (xhr.readyState === 4)
        {
            if (xhr.status === 200)
            {
                loadCart();
            }
            else
            {
                console.error('Remove product error:', xhr.statusText);
            }
        }
    };
    xhr.send();
}


loadCart();
