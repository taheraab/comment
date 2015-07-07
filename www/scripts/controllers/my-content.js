'use strict';
var myContentControllers = angular.module('myContentControllers', []);

//Controller for handling content search results
myContentControllers.controller('myContentController', ['$scope', '$location', '$http', 'books', 'notify',  
  function($scope, $location, $http, books, notify) {
    var searchObj = $location.search();
    $scope.curItemIndex = 0;
    $scope.contentList = [];
    $scope.unsavedContentList = {};
    
    /**
     * Get all saved content for user
     */
    function initUserContent() {
      $http.get('/bookService/getAll')
      .success(function(items) {
        $scope.contentList = items;
      });
      
    }
    
    /**
     * Init unsaved selected search items
     */
    function initUnsavedContent() {
      $scope.unsavedContentList = books.getCachedBooks();
      if (angular.isDefined(searchObj.volumeId)) {
        if (Object.keys($scope.unsavedContentList).indexOf(searchObj.volumeId) == -1) {
          books.cacheBook(searchObj.volumeId, function(cachedBooks) {
            $scope.unsavedContentList = cachedBooks;
            $scope.showItem(searchObj.volumeId, 'unsaved');
            $scope.$apply();
          });
        }else {
           $scope.showItem(searchObj.volumeId, 'unsaved');
        }
      } else {
        $scope.showItem(Object.keys($scope.unsavedContentList)[0], 'unsaved');        
        
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
 
    $scope.showItem = function(i, type) {
      if (type == 'saved') {
        $scope.item = $scope.contentList[i];
      }else {
        $scope.item = $scope.unsavedContentList[i];
      } 
        $scope.curItemIndex = i;
    };
    
    initUnsavedContent();   
  }
]);