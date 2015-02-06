'use strict';
var mainControllers = angular.module('mainControllers', []);

//Controller for handling content search results
mainControllers.controller('searchController', ['$scope', 'books', 
  function($scope, books) {
    $scope.results = {}
    $scope.query = '';

    $scope.searchContent = function() {
      books.search($scope.query, function(result) {
        $scope.results = result;
        console.log(result);  
      });
    };
    
    
  }
]);