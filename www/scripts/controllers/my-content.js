'use strict';
var myContentControllers = angular.module('myContentControllers', []);

//Controller for handling content search results
myContentControllers.controller('myContentController', ['$scope', '$location', '$http', 'books', 'notify',  
  function($scope, $location, $http, books, notify) {
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
    
    /**
    * Save book in database for given user
    */
    $scope.save = function() {
      $http.post('/bookService/addBook', $scope.item)
      .success(function(res) {
        if (res.result) notify.success(res.msg);
        else notify.error(res.msg);
      });
     
      
    }
  }
]);