class Order {
    constructor(opts) {
        this.orderDate = ""
        this.cart = {}
        this.FullCost = 0
        this.allItems = 0
        this.numItems = 0
        this.orderURL = opts.orderURL || "https://ibook.pivko24.ru:3030/neworder"
        this.Currency = 'USD'
        this.payments = [{ name: "Cash on Delivery", val: "cash" }, { name: "On-line", val: "online" }]
        this.Form = {
            name: { name: "name", placeholder: "Yor name", req: true, type: "text", minLength: 6, field: "input", ndx: 1, val: "", error: "", wclass: "col-sm-12 col-lg-8" },
            email: { name: "email", placeholder: "E-mail", req: true, type: "email", field: "input", ndx: 2, val: "", error: "", wclass: "col-sm-12 col-lg-4" },
            country: { name: "country", placeholder: "Country", req: true, field: "select", options: [], ndx: 3, val: "", error: "", wclass: "col-sm-12 col-lg-4" },
            state: { name: "state", placeholder: "State", req: false, field: "select", options: [], ndx: 4, val: "", error: "", wclass: "col-sm-12 col-lg-4" },
            city: { name: "city", placeholder: "City", req: true, type: "text", field: "input", ndx: 5, val: "", error: "", wclass: "col-sm-12 col-lg-4" },
            adress: { name: "adress", placeholder: "Street Adress", req: true, field: "textarea", ndx: 6, val: "", error: "", wclass: "col-sm-12" },
            payments: {
                name: "payments", type: "radio", field: "input", req: true, ndx: 7, val: false, error: "", options: this.payments, label: "Payment method", wclass: "col-sm-12"
            },
            createaccount: {
                name: "createaccount", type: "checkbox", field: "input", ndx: 7, val: false, error: "", label: "Create Account", wclass: "col-sm-12 col-lg-4"
            },
            passw: { name: "passw", placeholder: "6+ Symbols", req: true, minLength: 6, type: "password", field: "input", ndx: 8, val: "", error: "", label: "Password", wclass: "col-sm-12 col-lg-4" },
            passwconfirm: { name: "passwconfirm", placeholder: "Helps prevent typos", req: true, minLength: 6, type: "password", field: "input", ndx: 9, val: "", error: "", label: "Password (Again)", wclass: "col-sm-12 col-lg-4" },
            submit: { name: "submit", placeholder: "Order Pizza!", field: "button", ndx: 9, wclass: "col-sm-12 center", class: "shadowed rounded tertiary large" },
        }
        this.auth = ""
        this.storageItem = "lastorder"
        this.deliveryCost = 0
        this.neworder = {}


    }
    delItem(i) {
        delete this.cart[i.id]
        this.ReCalc()
    }
    toCart(i, add = true, qty = 0) {
        const ic = this.cart[i.id]
        if (ic) {
            if (!qty) {
                add ? ic.qty++ : ic.qty--
            } else {
                ic.qty = qty
            }
            !ic.qty && delete this.cart[i.id]
        } else {
            add ? this.cart[i.id] = { item: i, qty: qty ? qty : 1, pcost: 0 } : null
        }
        this.ReCalc()
    }
    Reset() {
        this.allItems = 0
        this.numItems = 0
        this.cart = {}
        this.ReCalc()
        localStorage.removeItem(this.storageItem)
    }
    ReCalc() {
        let cost = 0
        let items = 0
        Object.values(this.cart).forEach(i => {
            i.item.setPrice(this.Currency)
            cost += i.qty * i.item.price
            i.pcost = (i.qty * i.item.price).toFixed(2)
            items += i.qty
        })
        this.deliveryCost = this.DeliveryCalc()

        this.FullCost = cost.toFixed(2)
        this.allItems = items
        this.numItems = Object.values(this.cart).length
        this.Store()
    }
    DeliveryCalc() {
        const costs = [{ curr: "EUR", price: "9.00" }, { curr: "USD", price: "6.85" }]
        const cost = costs.filter(f => f.curr == this.Currency)
        return cost.length ? costs[0].price : 0
    }
    Store() {
        localStorage.setItem(this.storageItem, JSON.stringify(this.Order))
    }
    Restore(showcase) {
        const order = JSON.parse(localStorage.getItem(this.storageItem))
        if (order) {
            if (order.currency) this.Currency = order.currency
            if (order.info && Object.keys(order.info).length) {
                Object.keys(this.Form).forEach(f => {
                    if (order.info[f]) this.Form[f].val = order.info[f]
                })
            }
            if (order.cart) {
                Object.keys(order.cart).forEach(id => {
                    const item = showcase.filter(i => i.id == id)
                    item.length && item.forEach(i => this.toCart(i, true, order.cart[id]))
                })
            }
        }
    }
    async GetData(sdata = {}, url) {
        const headers = { 'Content-Type': 'application/json' }
        if (this.auth) headers['Authorization'] = this.auth
        try {
            const r = await fetch(url, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(sdata)
            })
            if (r.ok) {
                return await r.json();
            } else {
                return { message: "Server response error" }
            }
        }
        catch (e) {
            return { message: "Error accessing data server" }
        }
    }
    async Send() {
        this.Store()
        const response = await this.GetData(this.Order, this.orderURL)
        if (response.neworder) {
            this.Reset()
            this.neworder = response.neworder
        }
        return response.message
    }
    get Total() {
        return (+this.FullCost + +this.deliveryCost).toFixed(2)
    }
    get Order() {
        const cart = {}
        Object.values(this.cart).forEach(i => cart[i.item.id] = i.qty)
        return { info: this.Values, cart, currency: this.Currency, deliveryCost: this.deliveryCost, FullCost: this.FullCost }
    }
    get Values() {
        const values = {}
        Object.values(this.Form).forEach(f => values[f.name] = f.val)
        return values
    }
}
neworder = (opts) => new Order(opts)
pizza.factory('orders', () => {
    return {
        neworder: (opts) => neworder(opts),
    }
});