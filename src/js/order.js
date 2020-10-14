class Order {
    constructor(opts) {
        this.orderDate = ""
        this.cart = {}
        this.FullCost = 0
    }

    delItem(i) {
        delete this.cart[i.id]
        i.inCart = 0
        this.Store()
        this.ReCalc()
    }

    toCart(i, add = true) {
        const ic = this.cart[i.id]
        if (ic) {
            add ? i.inCart++ : i.inCart--
            ic.qty = i.inCart
            !ic.qty && delete this.cart[i.id]
        } else {
            i.inCart++
            add ? this.cart[i.id] = { item: i, qty: i.inCart, pcost: 0 } : null
        }
        console.log(this.cart);
        this.Store()
        this.ReCalc()
    }

    ReCalc() {
        let cost = 0
        Object.values(this.cart).forEach(i => {
            cost += i.qty * i.item.price
            i.pcost = i.qty * i.item.price
        })
        this.FullCost = cost
    }

    Store() {

    }
    ReStore() {

    }
}


neworder = (opts) => new Order(opts)
pizza.factory('orders', () => {
    return {
        neworder: (opts) => neworder(opts),
    }
});