var app = angular.module('mailissa', [
    'ngRoute',
    'ngResource'
]);

app.value('ipAPI', 'http://localhost:3000');

app.filter('reverse', function() {
    return function(items) {
        if (items)
            return items.slice().reverse();
        else
            return (undefined);
    };
});

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
        templateUrl: "/page/home.html",
        controller: "IndexCtrl"
    })
        .when('/mail/:id', {
        templateUrl: "/page/mail.html",
        controller: "ReadMailCtrl"
    })
        .when('/new', {
        templateUrl: "/page/new.html",
        controller: "NewCtrl"
    })
        .when('/sent', {
        templateUrl: "/page/sent.html",
        controller: "SentCtrl"
    })
        .when('/sent/:id', {
        templateUrl: "/page/read-sent.html",
        controller: "ReadSentCtrl"
    })
        .otherwise({redirectTo: '/'});
}]);