'use strict';
var mainControllers = angular.module('mainControllers', []);

//Controller for handling content search results
mainControllers.controller('searchController', ['$scope', 'books', 
  function($scope, books) {
    $scope.totalResults = books.getSearchResults();
    $scope.results = $scope.totalResults;
    $scope.query = books.getQueryText();
    $scope.curPage = 1;
    $scope.pageLength = books.getPageLength();;
    
    function setCurPage(pageNum) {
      $scope.results = $scope.totalResults.slice((pageNum - 1) * $scope.pageLength, pageNum * $scope.pageLength - 1);
      $scope.curPage = pageNum;
      console.log($scope.curPage);
    }
    
    $scope.searchContent = function() {
      books.search($scope.query, function(result) {
        $scope.totalResults = $scope.results = result;
        $scope.$apply();
      });
    };
    
    $scope.nextPage = function() {
      var newPage = $scope.curPage + 1;
      // if it is the last page, search for more
      if (newPage * $scope.pageLength > $scope.totalResults.length) {
        console.log("here");
        books.search($scope.query, function(result) {
          $scope.totalResults = result;
          setCurPage(newPage);
          $scope.$apply();
        }, false);
      }else {
        setCurPage(newPage);
      }
    };
    
    $scope.prevPage = function() {
      setCurPage($scope.curPage - 1);
    };
    
  }
]);