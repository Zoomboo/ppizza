const getCountries = require("cities-states-countries")
class Order {
    constructor(opts) {
        this.orderDate = ""
        this.cart = {}
        this.FullCost = 0
        this.Form = {
            name: { name: "name", placeholder: "Yor name", req: true, type: "text", minLength: 6, field: "input", ndx: 1, val: "", error: "" },
            country: { name: "country", placeholder: "Country", req: true, field: "select", options: this.Countries, ndx: 3, val: "", error: "" },
            state: { name: "state", placeholder: "State", req: false, field: "select", options: [], ndx: 4, val: "", error: "" },
            email: { name: "email", placeholder: "E-mail", req: true, type: "email", field: "input", ndx: 2, val: "", error: "" },
            city: { name: "city", placeholder: "City", req: true, type: "text", field: "input", ndx: 5, val: "", error: "" },
            adress: { name: "adress", placeholder: "Street Adress", req: true, field: "textarea", ndx: 6, val: "", error: "" },
        }
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



    Submit(form) {

        Object.values(this.Form).forEach(f => f.error = "")

        for (const type in form.$error) {


            const errors = form.$error[type]
            errors.forEach(f => {
                const field = this.Form[f.$name]

                switch (type) {
                    case 'minlength':
                        field.error = `The field must contain at least ${field.minLength} characters`
                        break;
                    case 'required':
                        field.error = `This field is required`
                        break;
                    case 'email':
                        field.error = `The email field was entered incorrectly`
                        break;
                }

            })

        }
    }
    fromUpdate() {
        this.Form.country.val ? this.Form.state.options = this.States : []
    }
    get Countries() {
        return getCountries.getCountries().map(c => c.name);
    }
    get States() {
        const d = getCountries.getStates(this.Form.country.val);
        return d
    }
}
neworder = (opts) => new Order(opts)
pizza.factory('orders', () => {
    return {
        neworder: (opts) => neworder(opts),
    }
});