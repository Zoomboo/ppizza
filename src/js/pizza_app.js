pizza = angular.module("pizza", ["ngRoute", "ngSanitize"]);
pizza.controller("pizzaapp", [
    "$scope",
    "catalog",
    "pizza",
    "orders",
    "userlogin",

    async function ($scope, catalog, pizza, orders, userlogin) {

        const UserLogin = userlogin.newuser({})
        UserLogin.Register()
        const Cat = catalog.newcatalog({ itemsURL: "https://ibook.pivko24.ru:3000/payers", newitem: pizza.newpizza })
        await Cat.getData();
        Cat.setCurr("EUR")
        const Order = orders.neworder({})


        Order.Form.name.val = "Alex"
        Order.Form.country.val = "Russia"
        Order.fromUpdate()

        $scope.Order = Order

        $scope.Form = Order.Form

        console.log($scope.Order);

        $scope.showcase = Cat.showcase

        $scope.$apply()




    }

])