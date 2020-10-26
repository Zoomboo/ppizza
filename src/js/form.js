const getCountries = require("cities-states-countries")
class Form {
    constructor(opts) {
        this.name = opts.name
        this.fields = opts.fields
        this.Form = {}
        this.valid = false
        this.errors = []
        this.message = ""
        this.prepareForm(Object.keys(this.fields))
        this.formUpdate()

    }
    Submit(form) {
        this.message = ""
        this.errors = []
        const passwconfirm = this.Form.passwconfirm
        const passw = this.Form.passw
        Object.values(this.fields).forEach(f => f.error = "")
        if (Object.keys(form.$error).length) {
            this.errors.push("Some fields are filled in incorrectly")
        }
        for (const type in form.$error) {
            const errors = form.$error[type]
            errors.forEach(f => {
                const field = this.fields[f.$name]
                const name = field.label || field.placeholder || field.name
                switch (type) {
                    case 'minlength':
                        field.error = `Field "${name}" must contain at least ${field.minLength} characters`
                        break;
                    case 'required':
                        field.error = `Field "${name}" is required`
                        break;
                    case 'email':
                        field.error = `Field "${name}" field was entered incorrectly`
                        break;
                }
            })


        }
        if (passwconfirm && passw && passwconfirm.val != passw.val) {
            passwconfirm.error = `Passwords do not match`
            this.errors.push("Passwords do not match")
        }
        return this.errors
    }
    formUpdate() {
        if (this.Form.country) {
            this.Form.country.val ? this.Form.state.options = this.States : []
        }
        if (this.Form.state) {
        }
        if (this.Form.createaccount) {
            const fields = ['name', 'email', 'country', 'state', 'city', 'adress', 'payments', 'createaccount', 'submit']
            !this.Form.createaccount.val ? this.prepareForm(fields) : this.prepareForm(Object.keys(this.fields))
        }
    }
    prepareForm(fields = []) {
        this.Form = {}
        fields.length ? fields.forEach(f => this.Form[f] = this.fields[f]) : Object.keys(this.fields).forEach(f => this.Form[f] = this.fields[f]);

    }
    get Values() {
        let values = {}
        Object.values(this.fields).forEach(f => values[f.name] = f.val)
        return values
    }
    get Countries() {
        return getCountries.getCountries().map(c => c.name);
    }
    get States() {
        const d = getCountries.getStates(this.Form.country.val);
        return d
    }
}
newform = (opts) => new Form(opts)
pizza.factory('forms', () => {
    return {
        newform: (opts) => newform(opts),
    }
});