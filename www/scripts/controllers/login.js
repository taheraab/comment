'use strict';

var loginControllers = angular.module('loginControllers', []);

loginControllers.controller('loginController', ['$scope', 'googlePlusAPI', '$http', '$window',
  function($scope, googlePlusAPI, $http, $window) {
    $scope.user = googlePlusAPI.getUser();
    googlePlusAPI.renderSigninBtn('googleLoginBtn');
    $scope.$watch(function() {return $scope.user.signedIn;}, function(newValue) {
      if (newValue) {
        $http.post('/loginservice/signin', {userId: $scope.user.profile.id})
          .success(function(data) {
            $window.location = "/index.html#/search";
          })
          .error(function(data) {
            console.log('Server Error');
          });
      }
    });
    
  }
]);