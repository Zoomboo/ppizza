class UserLogin {
    constructor(opts) {
        this.loginURL = opts.loginURL || "https://ibook.pivko24.ru:3030/login"
        this.registerURL = opts.registerURL || "https://ibook.pivko24.ru:3030/register"
        this.authdata = { login: "8100000000177", passw: "81" }
        this.regdata = { email: "343486@gmail.com", passw: "27erabul" }

    }
    async Register() {
        try {
            const r = await fetch(this.registerURL, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.regdata)
            })

        } catch (e) {
            throw (e);
        }
    }
    async Login() {
        try {
            const r = await fetch(this.loginURL, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.authdata)
            })


        } catch (e) {
            throw (e);
        }
    }

    Store() { }
    Restore() { }
    async AutoLogin() {

    }
}

newuser = (opts) => new UserLogin(opts)
pizza.factory('userlogin', () => {
    return {
        newuser: (opts) => newuser(opts),
    }
});