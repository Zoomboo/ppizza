
pizza.config(function ($routeProvider, $locationProvider) {

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    $routeProvider

        .when("/", {
            template: require('./../app/showcase.html')
        })

        .when("/checkout", {
            template: require('./../app/checkout.html')
        })
        .when("/login", {
            template: require('./../app/login.html')
        })
});
