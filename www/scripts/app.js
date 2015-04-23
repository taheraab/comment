'use strict';

/* Comment app configuration */
var app = angular.module('commentApp', 
  ['mainServices', 'mainDirectives', 'mainControllers', 'myContentControllers', 'loginControllers', 'ngRoute', 'ngSanitize']);

  
app.config(['$routeProvider', '$httpProvider', 
  function($routeProvider, $httpProvider) {
    
    $httpProvider.interceptors.push('myHttpInterceptor');
    
    $routeProvider
      .when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'loginController'
      })
      .when('/search', {
        templateUrl: 'partials/search.html',
        controller: 'searchController'
      })
      .when('/my-content', {
        templateUrl: 'partials/my-content.html',
        controller: 'myContentController'
      })
      .otherwise({
        redirectTo: '/login'
      });
  }
]);



