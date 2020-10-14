class Pizza {
    constructor(opts) {
        this.Name = opts.Description
        this.id = opts._id
        this.prices = [{ curr: "USD", price: 2.75 }, { curr: "EUR", price: 1.65 }]
        this.inCart = 0
    }
    AddOne() {
        this.inCart++
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