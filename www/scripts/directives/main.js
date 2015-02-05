'use strict';

/* Main Page Directives */
var mainDirectives = angular.module('mainDirectives', []);

/**
* Display login btn or logged in user info
*/
mainDirectives.directive('loginInfo', ['$window', 'googlePlusAPI',
  function($window, gapi) {
    function link(scope, element, attrs) {
      var options = {
        scope: 'https://www.googleapis.com/auth/plus.login',
        clientId: '37194207621-0tu7mjqcjoi45qa4ge20k6vvorul4bir.apps.googleusercontent.com',
        callback: gapi.onSignInCallback,
        theme: 'dark',
        cookiepolicy: 'single_host_origin',
        height: 'short',
        width: 'wide'
      };
      $window.gapi.signin.render('googleLoginBtn', options);
    }
    
    return {
      link: link,
      scope: {},
      templateUrl: '../partials/google-signin.html'
    };
  }  
]);