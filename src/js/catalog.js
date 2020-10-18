class Catalog {
    constructor(opts) {
        this.showcase = opts.showcase || []
        this.currencies = opts.currencies | []
        this.newitem = opts.newitem || {}
        this.itemsURL = opts.itemsURL
    }
    async getData() {
        try {
            const r = await fetch(this.itemsURL)
            const items = await r.json();
            if (items.length) {
                items.forEach(i => this.showcase.push(this.newitem(i)))
            }
        } catch (e) {
            throw (e);
        }
    }
    setCurr(curr) {
        this.showcase.forEach(i => i.setPrice(curr))
    }
}
newcatalog = (opts) => new Catalog(opts)
pizza.factory('catalog', () => {
    return {
        newcatalog: (opts) => newcatalog(opts),
    }
});