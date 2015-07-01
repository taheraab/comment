'use strict';
var myContentControllers = angular.module('myContentControllers', []);

//Controller for handling content search results
myContentControllers.controller('myContentController', ['$scope', '$location', '$http', 'books', 'notify',  
  function($scope, $location, $http, books, notify) {
    
    /**
     * Get all saved content for user
     */
    function initContentList() {
      $http.get('/bookService/getAll')
      .success(function(items) {
        $scope.contentList = items;
      });
      
    }
    
    /**
     * Init content details from selected source (from web or db)
     */
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
    };
 
    $scope.showItem = function(i) {
      $scope.item = $scope.contentList[i];
      $scope.curItemIndex = i;  
    };
    
    var searchObj = $location.search();
    $scope.curItemIndex = -1;
    
    if (angular.isDefined(searchObj.volumeId)) {
      init(searchObj.volumeId, 'web');
    }
    initContentList();
  }
]);