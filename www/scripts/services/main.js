'use strict';

/* Main services */
var mainServices = angular.module('mainServices', []);

mainServices.value('serverStatus', {timedOut: false});
/**
* Http interceptor to catch 401 response and redirect browser accordingly
*/
mainServices.factory('myHttpInterceptor', ['$q', '$location', 'serverStatus', 
  function($q, $location, serverStatus) {
    return {
      'responseError': function(rejection) {
        if (rejection.status == 401) {
          serverStatus.timedOut = true;
          $location.path('/login').replace();
        }
        return $q.reject(rejection);
      }
    };
  }
])

/** 
* This service handles all communication with GooglePlusApi 
* and keeps track of logged in user
*/
mainServices.factory('googlePlusAPI', ['$rootScope', '$http', 'serverStatus',
  function($rootScope, $http, serverStatus) {
    var user = {signedIn: false};
    
    var googleAPI = {
      getUser: function() {
        return user;
      },
      
      renderSigninBtn: function(elmId) {
        var options = {
          scope: 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/books',
          clientId: '37194207621-0tu7mjqcjoi45qa4ge20k6vvorul4bir.apps.googleusercontent.com',
          callback: googleAPI.onSigninCallback,
          theme: 'dark',
          cookiepolicy: 'single_host_origin',
          height: 'large',
          width: 'wide'
          //approvalprompt: 'force'
        };
        gapi.signin.render(elmId, options);  
      },
      
      signout: function() {
          gapi.auth.signOut();
          user.signedIn = false;
          user.profile = {};
      },
      
       /**
       * Called after signin and starts the post-authorization operations.
       *
       * @param {Object} authResult An Object which contains the access token and
       *   other authentication information.
       */
      onSigninCallback: function(authResult) {
        gapi.client.load('plus','v1').then(function() {
          if (authResult['access_token']) {
            googleAPI.getProfile();
            //Load books API
            gapi.client.load('books','v1');
          } else if (authResult['error']) {
            // There was an error, which means the user is not signed in.
            user.errMsg = authResult['error'];
            console.log('Google Signin error: ' + authResult['error']);
          }
        });
      },

      /**
       * Calls the OAuth2 endpoint to disconnect the app for the user.
       */
      disconnect: function() {
        // Revoke the access token.
        var req = {
          method: 'GET',
          url: 'https://accounts.google.com/o/oauth2/revoke?token=' +
              gapi.auth.getToken().access_token,
          headers: {
            contentType: 'application/json'
          },
          responseType: 'jsonp'
        };
        $http(req)
          .success(function(result) {
            console.log('revoke response: ' + result);
          })
          .error(function(e) {
            console.log(e);
          });
        
      },

      /**
       * Gets and renders the list of people visible to this app.
       */
      getPeople: function() {
        gapi.client.plus.people.list({
          'userId': 'me',
          'collection': 'visible'
        }).then(function(res) {
            var people = res.result;
            console.log(people);
            if (user.profile) {
              user.profile.friends = [
                  
              ];
            }
        });
      },

      /**
       * Gets and renders the currently signed in user's profile data.
       */
      getProfile: function(){
        gapi.client.plus.people.get({
          'userId': 'me'
        }).then(function(res) {
            var profile = res.result;
            $rootScope.$apply(function() {
              user.signedIn = true;
              user.profile = {
                id: profile.id,
                name: profile.displayName,
                imageUrl: profile.image.url
              };
            });  
            console.log(profile);
          }, function(err) {
            var error = err.result;
            console.log(error.message);
        });
      }
    };
    
    $rootScope.$watch(function() {return serverStatus.timedOut;}, function(val) {
      if (val) { 
        googleAPI.signout();
      }
    });
    return googleAPI;
  }
]);


/**
* This is a notification service to display UI alerts
*/
mainServices.factory('notify', ['$timeout',
  function($timeout) {
    // Display #notify div with msg
    function showNotification(type, msg) {
      var $body = angular.element(document.getElementsByTagName('body')[0]);
      var $notification = angular.element('<div id="notification" class="alert notification" role="alert">' 
      + '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' 
      + '<span aria-hidden="true">&times;</span></button></div>');
      $body.append($notification);
      var alertClass = 'alert-' + type;
      $notification.append('<div class="msg">' + msg + '</div>');
      $notification.addClass(alertClass);
      $notification.fadeIn();
      $timeout(function() {
        $notification.fadeOut(function() {
          $notification.remove();
        });
      }, 5000);
    }
    return {
      success: function(msg) {
        showNotification('success', msg);
      },
      info: function(msg) {
        showNotification('info', msg);        
      },
      error: function(msg) {
        showNotification('danger', msg);
      }
    }
  }
]);