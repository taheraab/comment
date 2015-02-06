'use strict';

/* Main services */
var mainServices = angular.module('mainServices', []);

/** 
* This service handles all communication with GooglePlusApi 
* and keeps track of logged in user
*/
mainServices.factory('googlePlusAPI', ['$rootScope', '$http',
  function($rootScope, $http) {
    var user = {signedIn: false};
    
    var googleAPI = {
      getUser: function() {
        return user;
      },
      
      renderSigninBtn: function(elmId) {
        var options = {
          scope: 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/books',
          clientId: '37194207621-0tu7mjqcjoi45qa4ge20k6vvorul4bir.apps.googleusercontent.com',
          callback: googleAPI.onSignInCallback,
          theme: 'dark',
          cookiepolicy: 'single_host_origin',
          height: 'short',
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
      onSignInCallback: function(authResult) {
        gapi.client.load('plus','v1').then(function() {
          if (authResult['access_token']) {
            googleAPI.getProfile();
            googleAPI.getPeople();
            //Load books API
            gapi.client.load('books','v1');
          } else if (authResult['error']) {
            // There was an error, which means the user is not signed in.
            console.log('Google Signin error: ' + authResult['error']);
          }
          console.log('authResult', authResult);
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
              name: profile.displayName
              };
            });  
            console.log(user);
          }, function(err) {
            var error = err.result;
            console.log(error.message);
        });
      }
    };
    
    return googleAPI;
  }
]);

/**
* Service that searches for books given a query and returns result
*/
mainServices.factory('books', ['$rootScope', 
  function($rootScope) {
    var searchResults = {};
    
    var booksAPI = {      
      /* search for books using full text search */
      search: function(query, done) {
        gapi.client.books.volumes.list({
            q: query,
            maxResults: 5
        }).then(function(res) {
          console.log(res);
          done(res.result.items);
        },function(err) {
          console.log(err);
          done({});
        });
      }
      
    };
    return booksAPI;
  }
]);