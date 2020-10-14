pizza.config(function ($routeProvider) {
    $routeProvider
        .when("/checkout", {

            template: require('./../app/checkout.html')
        })
        .when("/", {

            template: require('./../app/showcase.html')
        })


});