pizza.config(function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
    $routeProvider
        .when("/checkout", {
            template: require('./../app/checkout.html')
        })
        .when("/", {
            template: require('./../app/showcase.html')
        })
        .when("/login", {
            template: require('./../app/login.html')
        })
        .when("/register", {
            template: require('./../app/register.html')
        })
        .when("/history", {
            template: require('./../app/history.html')
        })
});
