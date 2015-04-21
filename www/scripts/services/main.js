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
    
    $rootScope.$watch(function() {return serverStatus.timedOut;}, function(val) {
      if (val) { 
        googleAPI.signout();
      }
    });
    return googleAPI;
  }
]);

/**
* Service that searches for books given a query and returns result
*/
mainServices.factory('books', ['$rootScope', '$filter',
  function($rootScope, $filter) {
    var searchResults = [];
    var queryText = '';
    var pageLength = 10;

    function getRatingsArray(rating) {
      var result = ['empty', 'empty', 'empty', 'empty', 'empty'];
      if (angular.isDefined(rating) && !isNaN(parseFloat(rating))) {
        var r = parseFloat(rating);
        var i = 0;
        while (r >= 1) {
          result[i++] = 'full';
          --r;
        }
        if (r > 0) result[i] = 'half';
      }
      return result;
    }

    
    var booksAPI = {      
      /* search for books using full text search */
      search: function(query, done, isNewSearch) {
        var isNewSearch = angular.isDefined(isNewSearch)? isNewSearch: true;
        if (isNewSearch) {
          queryText = query;
          searchResults = [];
        }
        gapi.client.books.volumes.list({
            q: queryText,
            maxResults: pageLength,
            startIndex: searchResults.length
        }).then(function(res) {
          for (var i = 0; i < res.result.items.length; i++) {
            var item = res.result.items[i];
            var result = {
              title: item.volumeInfo.title,
              snippet: angular.isDefined(item.searchInfo)? item.searchInfo.textSnippet : item.volumeInfo.description,
              rating: getRatingsArray(item.volumeInfo.averageRating),
              publishedBy: angular.isDefined(item.volumeInfo.publisher)? item.volumeInfo.publisher: 'Unknown',
              publishedDate: item.volumeInfo.publishedDate,
              authors: angular.isDefined(item.volumeInfo.authors)? item.volumeInfo.authors.join(', '): 'Unknown',
              thumbnailLink: angular.isDefined(item.volumeInfo.imageLinks)? item.volumeInfo.imageLinks.thumbnail: '',
              contentLink: item.volumeInfo.canonicalVolumeLink,
              id: item.id
            };
            searchResults.push(result);
          }
          done(searchResults);
        },function(err) {
          console.log(err);
          done([]);
        });
        
      },
      
      /* retrieve a book using its volumeId */
      getBook: function(volumeId, done) {
        gapi.client.books.volumes.get({
            volumeId: volumeId
        }).then(function(res) {
            var item = res.result;
            console.log(item);
            var result = {
              title: item.volumeInfo.title,
              description: item.volumeInfo.description,
              rating: getRatingsArray(item.volumeInfo.averageRating),
              publishedBy: angular.isDefined(item.volumeInfo.publisher)? item.volumeInfo.publisher: 'Unknown',
              publishedDate: item.volumeInfo.publishedDate,
              authors: angular.isDefined(item.volumeInfo.authors)? item.volumeInfo.authors.join(', '): 'Unknown',
              thumbnailLink: angular.isDefined(item.volumeInfo.imageLinks)? item.volumeInfo.imageLinks.thumbnail: '',
              contentLink: item.volumeInfo.canonicalVolumeLink,
              id: item.id,
              categories: item.volumeInfo.categories[0],
              pageCount: item.volumeInfo.pageCount
            };
          done(result);
        },function(err) {
          console.log(err);
          done({});
        });
        
      },
      
      getSearchResults: function() {
        return searchResults;
      },
      
      getQueryText: function() {
        return queryText;
      },
    
      getPageLength: function() {
        return pageLength;
      }
    };
    return booksAPI;
  }
]);