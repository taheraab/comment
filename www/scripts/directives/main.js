'use strict';

/* Main Page Directives */
var mainDirectives = angular.module('mainDirectives', []);

/**
* Display login btn or logged in user info
*/
mainDirectives.directive('loginInfo', ['googlePlusAPI',
  function(googleAPI) {
    function link(scope, element, attrs) {
      scope.user = googleAPI.getUser();
      
      if (!scope.user.signedIn) {
        //Render the signin button
        googleAPI.renderSigninBtn('googleLoginBtn');
      }
      scope.signout = function() {
        googleAPI.signout();
      };
      
    }
    
    return {
      link: link,
      scope: {},
      templateUrl: '../partials/google-signin.html'
    };
  }  
]);