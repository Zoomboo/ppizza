class UserLogin {
    constructor(opts) {
        this.loginURL = opts.loginURL || "https://ibook.pivko24.ru:3030/login"
        this.registerURL = opts.registerURL || "https://ibook.pivko24.ru:3030/register"
        this.Form = {
            name: { name: "name", placeholder: "Alex Doe", req: true, type: "text", minLength: 6, field: "input", ndx: 1, val: "", error: "", label: "Your Name", wclass: "col-sm-12 col-lg-8" },
            email: { name: "email", placeholder: "alexdoe@example.com", req: true, type: "email", field: "input", ndx: 2, val: "", error: "", label: "Email", wclass: "col-sm-12 col-lg-4" },
            passw: { name: "passw", placeholder: "6+ Symbols", req: true, minLength: 6, type: "password", field: "input", ndx: 3, val: "", error: "", label: "Password", wclass: "col-sm-12 col-lg-4" },
            passwconfirm: { name: "passwconfirm", placeholder: "Helps prevent typos", req: true, minLength: 6, type: "password", field: "input", ndx: 4, val: "", error: "", label: "Password (Again)", wclass: "col-sm-12 col-lg-4" },
            policy: {
                name: "policy", req: true, type: "checkbox", field: "input", ndx: 7, val: false, error: "", label: "I've read and agreed Privacy policy", wclass: "col-sm-12"
            },
            remember: { name: "remember", type: "checkbox", field: "input", ndx: 8, val: false, error: "", label: "Remember me", wclass: "col-sm-12 col-lg-4" },
            submitLogin: { name: "submitLogin", placeholder: "Sign Up!", field: "button", ndx: 10, wclass: "col-sm-12  center", class: "shadowed rounded tertiary large" },
            submitRegister: { name: "submitRegister", placeholder: "Sign In!", field: "button", ndx: 11, wclass: "col-sm-12  center", class: "shadowed rounded tertiary large" },
            loginbutton: { name: "loginbutton", placeholder: "I have an account", field: "link", href: "login", ndx: 12, wclass: "col-sm-12 col-lg-6 center", class: "shadowed rounded tertiary button large" },
            registerbutton: { name: "registerbutton", placeholder: "Create an account", field: "link", href: "register", ndx: 13, wclass: "col-sm-12 col-lg-6 center", class: "shadowed rounded tertiary button large" },
        }
        this.authhash = ""
        this.User = {}
        this.History = []
        this.storageItem = "lastuser"
    }

    Logout() {
        this.authhash = ""
        this.User = {}
        this.History = []
        localStorage.removeItem(this.storageItem)
    }

    async Register(regdata) {
        let message = ""
        const response = await this.GetData(regdata, this.registerURL)
        switch (response.status) {
            case 3:
                this.User = response.newuser
                this.History = response.history
                break;
            case 4:
                break;
        }
        message = response.message
        return message
    }
    async GetData(sdata, url) {

        const request = { method: "GET", headers: { 'Content-Type': 'application/json' } }
        if (this.authhash) request.headers.authorization = this.authhash

        try {

            if (Object.keys(sdata).length) {
                request.body = JSON.stringify(sdata)
                request.method = "POST"
            }
            const r = await fetch(url, request)
            if (r.ok) {
                return await r.json();
            }
        }
        catch (e) {
            return { message: "Error accessing data server" }
        }
    }
    async Login(authdata = {}) {
        let message = ""
        const response = await this.GetData(authdata, this.loginURL)
        switch (response.status) {
            case 5:
                this.User = response.fuser
                this.History = response.history
                authdata.remember && this.Store()
                break;
            case 4:
                break;
        }
        message = response.message
        return message
    }
    Store() {
        localStorage.setItem(this.storageItem, JSON.stringify(this.User));
    }
    async Restore() {
        const suser = JSON.parse(localStorage.getItem(this.storageItem))
        if (suser && suser.hash) {
            this.authhash = suser.hash
            await this.Login()
        }




    }
    get RegForm() {
        const form = {}
        const fields = ["name", "email", "passw", "passwconfirm", "policy", "submitRegister"]
        fields.forEach(f => form[f] = this.Form[f])
        return form
    }
    get LoginForm() {
        return { email: this.Form.email, passw: this.Form.passw, remember: this.Form.remember, submitLogin: this.Form.submitLogin }
    }
}
newuser = (opts) => new UserLogin(opts)
pizza.factory('userlogin', () => {
    return {
        newuser: (opts) => newuser(opts),
    }
});