'use strict';
var mainControllers = angular.module('mainControllers', []);


mainControllers.controller('mainController', ['$scope', '$location', 'googlePlusAPI', '$http',
  function($scope, $location, googleAPI, $http) {
    $scope.user = googleAPI.getUser();
    
    $scope.signout = function() {
      googleAPI.signout();
      $http.get('/loginservice/signout');
      $location.path('/login').replace();
      
    };
        
    $scope.menuItem = '/search';
    var pathSegment = $location.path();
    if (pathSegment != '') $scope.menuItem = pathSegment;
    
    //Check if user is signed in during each change of route
    $scope.$on('$routeChangeStart', function(event, args) {
      if (angular.isDefined(args.$$route)) {
        if (args.$$route.originalPath != '/login') {
          $scope.menuItem = args.$$route.originalPath;
          if (!googleAPI.getUser().signedIn) {
            $location.path('/login').replace();
          }
        }
      }
    });

  }
]);

//Controller for handling content search results
mainControllers.controller('searchController', ['$scope', 'books', '$location', 
  function($scope, books, $location) {
    $scope.totalResults = books.getSearchResults();
    $scope.results = $scope.totalResults;
    $scope.query = books.getQueryText();
    $scope.curPage = 1;
    $scope.pageLength = books.getPageLength();;
    
    function setCurPage(pageNum) {
      $scope.results = $scope.totalResults.slice((pageNum - 1) * $scope.pageLength, pageNum * $scope.pageLength - 1);
      $scope.curPage = pageNum;
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