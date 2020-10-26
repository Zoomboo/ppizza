class Catalog {
    constructor(opts) {
        this.showcase = opts.showcase || []
        this.currencies = opts.currencies | []
        this.newitem = opts.newitem || {}
        this.itemsURL = opts.itemsURL || "https://ibook.pivko24.ru:3030/goods"
    }
    async getData() {
        try {
            const r = await fetch(this.itemsURL)
            if (r.ok) {
                const items = await r.json();
                items.length && items.forEach(i => this.showcase.push(this.newitem(i)))
            }
        } catch (e) {
            console.log(e);
            console.log("Error");
        }
    }
    setCurr(curr) {
        this.showcase.forEach(i => i.setPrice(curr))
    }
    get Currencies() {
        let curr = []
        this.showcase.forEach(i => {
            if (i.prices.length) curr = [...curr, ...i.prices.map(p => p.curr)]
        })
        return [...new Set(curr)]
    }
}
newcatalog = (opts) => new Catalog(opts)
pizza.factory('catalog', () => {
    return {
        newcatalog: (opts) => newcatalog(opts),
    }
});