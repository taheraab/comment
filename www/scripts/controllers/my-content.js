'use strict';
var myContentControllers = angular.module('myContentControllers', []);

//Controller for handling content search results
myContentControllers.controller('myContentController', ['$scope', '$location', '$http', 'books', 'notify', 'userBooks','googlePlusAPI',  
  function($scope, $location, $http, books, notify, userBooks, googleAPI) {
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
    $scope.save = function() {
      var unsaved = $scope.item.commentApp.unsaved;
      var curId = $scope.curItemIndex;
      userBooks.save($scope.curItemIndex, $scope.item, function(res) {
        if (res.result) {
          notify.success(res.msg);
          if (unsaved) { //if new book was added
            $scope.showItem(0, 'saved');
            delete $scope.unsavedContentList[curId];
          }else {
            $scope.item.commentApp.editMode = false;
          }
        }
        else notify.error(res.msg);
      });
    };

    /**
     * Save comment for current item 
     */ 
    $scope.saveComment = function() {
      userBooks.saveComment($scope.curItemIndex, $scope.item, function(res) {
        if (res.result) {
          notify.success(res.msg);
          $scope.cancelCommentEdit();
        }else notify.error(res.msg);
      });
    };
    
    /**
     * Start editing a new comment
     */
    $scope.startCommentEdit = function() {
      var user = googleAPI.getUser();
      //initialize new comment
      $scope.item.commentApp.comment = {
        userId: user.profile.id,
        username: user.profile.name,
        userImageUrl: user.profile.imageUrl
      };
      $scope.item.commentApp.commentEditMode = true;
    }
    
    /**
     * Cancel comment editing
     */
    $scope.cancelCommentEdit = function() {
      //initialize new comment
      delete $scope.item.commentApp.comment;
      $scope.item.commentApp.commentEditMode = false;
    }
     
    /**
     * Display selected content item
     */
    $scope.showItem = function(i, type) {
      if (type == 'saved') {
        userBooks.get(i, function(book) {
          $scope.item = book.value;
          $scope.item.commentApp = {unsaved: false};
          console.log($scope.item.comments);     
        });
      }else {
        $scope.item = $scope.unsavedContentList[i];
        $scope.item.commentApp = {unsaved: true};
      } 
        $scope.curItemIndex = i;
    };
    
    initUserContent();
    initUnsavedContent();   
  }
]);