'use strict';

/* Main services */
var mainServices = angular.module('mainServices', []);

/** 
* This service handles all communication with GooglePlusApi 
* and keeps track of logged in user
*/
mainServices.factory('googlePlusAPI', [ '$http',
  function($http) {
    var userId = null;
    
    return {
       /**
       * Called after signin and starts the post-authorization operations.
       *
       * @param {Object} authResult An Object which contains the access token and
       *   other authentication information.
       */
      onSignInCallback: function(authResult) {
        gapi.client.load('plus','v1').then(function() {
          if (authResult['access_token']) {
            console.log('Access token received: ' + authResult['access_token']);
          } else if (authResult['error']) {
            // There was an error, which means the user is not signed in.
            console.log('There was an error: ' + authResult['error']);
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
      people: function() {
        gapi.client.plus.people.list({
          'userId': 'me',
          'collection': 'visible'
        }).then(function(res) {
          var people = res.result;
            console.log(people);
          for (var personIndex in people.items) {
            person = people.items[personIndex];
            console.log('person: ' +  person);
          }
        });
      },

      /**
       * Gets and renders the currently signed in user's profile data.
       */
      profile: function(){
        gapi.client.plus.people.get({
          'userId': 'me'
        }).then(function(res) {
            var profile = res.result;
            console.log(profile);  
          }, function(err) {
            var error = err.result;
            console.log(error.message);
        });
      }
    };
  }
]);