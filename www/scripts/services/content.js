'use strict';
/**
 * Content services to access media (books, movies, etc)
 */
 var contentServices = angular.module('contentServices', []);
 /**
* Service that searches for books given a query and returns result
*/
contentServices.factory('books', 
  function() {
    var searchResults = [];
    var queryText = '';
    var pageLength = 10;
    var cachedBooks = {};

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
 
      cacheBook: function(id, done) {
        if (!angular.isDefined(cachedBooks[id])) {
          this.getBook(id, function(result) {
            if (result) {
              cachedBooks[id] = result;
            }
            done(cachedBooks);
          });
        }else done(cachedBooks); 
      },
           
      getSearchResults: function() {
        return searchResults;
      },
      
      getCachedBooks: function() {
        return cachedBooks;
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
);
