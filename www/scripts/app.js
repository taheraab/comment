'use strict';

/* Comment app configuration */
var app = angular.module('commentApp', 
  ['mainServices', 'mainDirectives', 'mainControllers', 'ngRoute', 'ngSanitize']);

app.config(['$routeProvider', 
  function($routeProvider) {
    $routeProvider
      .when('/search', {
        templateUrl: 'partials/search.html',
        controller: 'searchController'
      })
      .otherwise({
        redirectTo: '/search'
      });
  }
]);;