'use strict';
var mainControllers = angular.module('mainControllers', []);

//Controller for handling content search results
mainControllers.controller('searchController', ['$scope', 'books', 
  function($scope, books) {
    $scope.results = books.getSearchResults();
    $scope.query = books.getQueryText();
    
    $scope.searchContent = function() {
      books.search($scope.query, function(result) {
        console.log(result);
        $scope.results = result;
        $scope.$apply();
      });
    };
    
    
  }
]);