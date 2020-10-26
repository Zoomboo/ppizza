pizza = angular.module("pizza", ["ngRoute", "ngSanitize"]);
pizza.controller("pizzaapp", [
    "$scope",
    "$location",
    "catalog",
    "pizza",
    "orders",
    "userlogin",
    "forms",
    async function ($scope, $location, catalog, pizza, orders, userlogin, forms) {
        $scope.User = {}
        $scope.loading = true
        setUser = () => {
            $scope.User = UserLogin.User
            $scope.History = UserLogin.History
            $scope.Order.auth = $scope.User.hash
            $scope.Order.Form.name.val = $scope.User.name
            $scope.Order.Form.email.val = $scope.User.email
            $scope.checkoutform.prepareForm(['name', 'email', 'country', 'state', 'city', 'adress', 'payments', 'submit'])
        }

        const UserLogin = userlogin.newuser({})
        const Cat = catalog.newcatalog({ newitem: pizza.newpizza })
        const Order = orders.neworder({})
        $scope.RegForm = forms.newform({ name: "RegForm", fields: UserLogin.RegForm })
        $scope.LoginForm = forms.newform({ name: "LoginForm", fields: UserLogin.LoginForm })
        $scope.Order = Order
        $scope.Order.cartOpen = false
        await Cat.getData();
        $scope.Currencies = Cat.Currencies
        $scope.showcase = Cat.showcase
        Order.Restore(Cat.showcase)
        $scope.checkoutform = forms.newform({ name: "checkoutform", fields: Order.Form })
        $scope.checkoutform.fields.country.options = $scope.checkoutform.Countries
        $scope.thiscurr = Order.Currency
        Cat.setCurr($scope.thiscurr)
        await UserLogin.Restore()
        UserLogin.User.id && setUser()
        $scope.loading = false
        $scope.SetCurr = function (curr) {
            Order.Currency = curr
            Order.ReCalc()
            Cat.setCurr(curr)
        }
        $scope.LoginFormSubmit = async fd => {
            const errors = $scope.LoginForm.Submit(fd)
            if (!errors.length) {
                $scope.LoginForm.message = await UserLogin.Login($scope.LoginForm.Values)
                setUser()
                $scope.User.id && $location.path("history")
                $scope.$apply()
            }
        }
        $scope.RegisterFormSubmit = async fd => {
            const errors = $scope.RegForm.Submit(fd)
            if (!errors.length) {
                $scope.RegForm.message = await UserLogin.Register($scope.RegForm.Values)
                setUser()
                $location.path("/")
                $scope.$apply()
            }
        }
        $scope.CheckoutFormSubmit = async fd => {
            const errors = $scope.checkoutform.Submit(fd)
            if (!errors.length) {
                if ($scope.checkoutform.Values.createaccount) {
                    $scope.checkoutform.message = await UserLogin.Register($scope.checkoutform.Values)
                    $scope.$apply()
                    if (UserLogin.User.id) {
                        setUser()
                        $scope.checkoutform.message = await Order.Send()
                        $scope.User.id && $location.path("history")
                        $scope.$apply()
                    }
                } else {
                    $scope.checkoutform.message = await Order.Send()
                    if ($scope.User.id) {
                        $scope.History.push($scope.Order.neworder)
                        $location.path("history")
                    }
                    $scope.$apply()
                }
                //$scope.RegForm.message = await UserLogin.Register($scope.RegForm.Values)
            }
        }
        $scope.LogOut = () => {
            $scope.User = {}
            $scope.History = {}
            UserLogin.Logout()
            $scope.checkoutform.prepareForm()
            $scope.checkoutform.formUpdate()
            $location.path("/")
        }
        $scope.$apply()
    }
])
pizza.directive('forma', function () {
    return {
        restrict: 'EA',
        scope: {
            form: '=',
            onSubmit: '='
        },
        replace: true,
        template: require('./../app/forma.html')
    }
})
pizza.directive('currencies', function () {
    return {
        restrict: 'EA',
        scope: {
            opts: '=',
            thiscurr: '=',
            onSelect: '='
        },
        replace: true,
        template: require('./../app/currencies.html')
    }
})
pizza.directive('cart', function () {
    return {
        restrict: 'EA',
        scope: {
            order: '=',
        },
        replace: true,
        template: require('./../app/cart.html')
    }
})
pizza.directive('mheader', function () {
    return {
        restrict: 'EA',
        template: require('./../app/header.html')
    }
})
pizza.directive('messge', function () {
    return {
        restrict: 'EA',
        scope: {
            neworder: '=',
        },
        replace: true,
        template: require('./../app/neworder.html')
    }
})