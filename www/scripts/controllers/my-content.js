'use strict';
var myContentControllers = angular.module('myContentControllers', []);

//Controller for handling content search results
myContentControllers.controller('myContentController', ['$scope', '$location', '$http', 'books', 'notify', 'userBooks',  
  function($scope, $location, $http, books, notify, userBooks) {
    var searchObj = $location.search();
    $scope.curItemIndex = 0;
    $scope.bookList = [];
    $scope.unsavedContentList = {};
    $scope.ucExpanded = $scope.bExpanded = true;
    
    
    /**
     * Get all saved content for user
     */
    function initUserContent() {
      userBooks.getAll(function(items) {
        $scope.bookList = items;
        if ($scope.bookList.length) $scope.showItem(0, 'saved');
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
        }else $scope.showItem(searchObj.volumeId, 'unsaved');
      }else {
        if (Object.keys($scope.unsavedContentList).length) $scope.showItem(Object.keys($scope.unsavedContentList)[0], 'unsaved');        
      }
    }
    
    /**
    * Save book in database for given user
    */
    $scope.save = function(i, type) {
      userBooks.save(type, i, $scope.item, function(res) {
        if (res.result) notify.success(res.msg);
        else notify.error(res.msg);
      });
    };
 
    $scope.showItem = function(i, type) {
      if (type == 'saved') {
        userBooks.get(i, function(book) {
          $scope.item = book.value;
          console.log($scope.bookList);      
        });
      }else {
        $scope.item = $scope.unsavedContentList[i];
      } 
        $scope.curItemIndex = i;
    };
    
    initUserContent();
    initUnsavedContent();   
  }
]);