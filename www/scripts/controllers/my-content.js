'use strict';
var myContentControllers = angular.module('myContentControllers', []);

//Controller for handling content search results
myContentControllers.controller('myContentController', ['$scope', '$location', 'books', 
  function($scope, $location, books) {
    var searchObj = $location.search();
    if (angular.isDefined(searchObj.volumeId)) {
      init(searchObj.volumeId, 'web');
    }
    
    function init(id, source) {
      var source = angular.isDefined(source)? source: 'web';
      if (source == 'web') {
        books.getBook(id, function(item) {
          $scope.item = item;
          $scope.$apply();
        });
      }
      
    }
  }
]);