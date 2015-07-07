'use strict';

var loginControllers = angular.module('loginControllers', []);

loginControllers.controller('loginController', ['$scope', 'googlePlusAPI', '$http', '$location',
  function($scope, googleAPI, $http, $location) {
    $scope.user = googleAPI.getUser();
    googleAPI.renderSigninBtn('googleLoginBtn');
    $scope.$watch(function() {return googleAPI.getUser().signedIn;}, function(newValue, oldval) {
      if (newValue) {
        $http.post('/loginservice/signin', {userId: googleAPI.getUser().profile.id})
          .success(function(data) {
            $location.path('/search').replace();
          })
          .error(function(data) {
            console.log('Server Error');
          });
      }
    });
    
  }
]);