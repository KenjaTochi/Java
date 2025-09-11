class CartModel
{
    constructor()
    {
        this.cartItems = [];
    }

    getCart()
    {
        return this.cartItems;
    }

    addToCart(product)
    {
        const existing = this.cartItems.find(item => item.id === product.id);
        if (existing)
        {
            existing.quantity += 1;
            return true;
        }

        const priceNum = (typeof product.price === 'string')
            ? parseFloat(product.price.replace('$', ''))
            : product.price;

        this.cartItems.push(
        {
            ...product,
            price: priceNum,
            quantity: 1
        });

        return true;
    }

    updateQuantity(productId, quantity)
    {
        const item = this.cartItems.find(item => item.id === productId);
        if (!item || quantity < 1)
        {
            return false;
        }

        item.quantity = quantity;
        return true;
    }

    removeFromCart(productId)
    {
        const index = this.cartItems.findIndex(item => item.id === productId);
        if (index !== -1)
        {
            this.cartItems.splice(index, 1);
            return true;
        }
        return false;
    }

    getTotal()
    {
        return this.cartItems.reduce((sum, item) =>
        {
            const priceNum = (typeof item.price === 'string')
                ? parseFloat(item.price.replace('$', ''))
                : item.price;

            return sum + (isNaN(priceNum) ? 0 : priceNum * (item.quantity || 1));
        }, 0);
    }
}

module.exports = CartModel;
