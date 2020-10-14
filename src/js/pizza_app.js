pizza = angular.module("pizza", ["ngRoute", "ngSanitize"]);
pizza.controller("pizzaapp", [
    "$scope",
    "catalog",
    "pizza",
    "orders",

    async function ($scope, catalog, pizza, orders) {

        const Cat = catalog.newcatalog({ itemsURL: "https://ibook.pivko24.ru:3000/payers", newitem: pizza.newpizza })
        await Cat.getData();
        Cat.setCurr("EUR")
        $scope.Order = orders.neworder({})

        console.log($scope.Order);

        $scope.showcase = Cat.showcase
        $scope.$apply()
    }

])