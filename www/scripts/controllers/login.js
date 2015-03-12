'use strict';

var loginControllers = angular.module('loginControllers', []);

loginControllers.controller('loginController', ['$scope', 'googlePlusAPI',
  function($scope, googlePlusAPI) {
    
    googlePlusAPI.renderSigninBtn('googleLoginBtn');
    
  }
]);