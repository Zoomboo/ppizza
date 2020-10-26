class Pizza {
    constructor(opts) {
        this.Name = opts.title
        this.Description = opts.description
        this.id = opts._id
        this.img = opts.image
        this.prices = opts.prices || [{ curr: "USD", price: 2.75 }, { curr: "EUR", price: 1.65 }]

    }

    setPrice(curr) {
        const price = this.prices.filter(p => p.curr == curr)[0]
        this.price = price.price
    }
}
newpizza = (opts) => new Pizza(opts)
pizza.factory('pizza', () => {
    return {
        newpizza: (opts) => newpizza(opts),
    }
});