'use strict';

var loginControllers = angular.module('loginControllers', []);

loginControllers.controller('loginController', ['$scope', 'googlePlusAPI', '$http', '$location',
  function($scope, googlePlusAPI, $http, $location) {
    $scope.user = googlePlusAPI.getUser();
    googlePlusAPI.renderSigninBtn('googleLoginBtn');
    $scope.$watch(function() {return $scope.user.signedIn;}, function(newValue) {
      if (newValue) {
        $http.post('/loginservice/signin', {userId: $scope.user.profile.id})
          .success(function(data) {
            
          })
          .error(function(data) {
            console.log('Server Error');
          });
      }
    });
    
  }
]);