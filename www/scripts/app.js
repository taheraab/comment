'use strict';

/* Comment app configuration */
var app = angular.module('commentApp', 
  ['mainServices', 'mainDirectives', 'mainControllers', 'myContentControllers', 'ngRoute', 'ngSanitize']);

app.config(['$routeProvider', 
  function($routeProvider) {
    $routeProvider
      .when('/search', {
        templateUrl: 'partials/search.html',
        controller: 'searchController'
      })
      .when('/my-content', {
        templateUrl: 'partials/my-content.html',
        controller: 'myContentController'
      })
      .otherwise({
        redirectTo: '/search'
      });
  }
]);;