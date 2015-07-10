'use strict';
/**
 * Content services to access media (books, movies, etc)
 */
var bookServices = angular.module('bookServices', []);
 
/**
* Service that searches for books given a query and returns result
*/
bookServices.factory('books', 
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

/**
 * Service to retrieve user saved books from DB
 */
 bookServices.factory('userBooks', ['$http', 
   function($http) {
     var bookList = [];
     return {
       
       /**
        * Return all book titles
        */
       getAll: function(done) {
          if (bookList.length == 0) {
            $http.get('/bookservice/getAll')
            .success(function(result) {
                for (var i = 0; i < result.length; i++) {
                  bookList.push({type: 'summary', value: result[i]});
                }
                done(bookList);
            });  
          }else done(bookList);
       },
       
       /**
        * Get book details 
        */
       get: function(i, done) {
          if (bookList[i].type == 'summary') {
            $http.get('/bookservice/get/' +  bookList[i].value._id)
            .success(function(result){
               bookList[i].value = result;
               bookList[i].type = 'detail';
               done(bookList[i]);
            });
          }else done(bookList[i]);
       },
       
       save: function(i, book, done) {
          if (book.commentApp.unsaved) { // this is a new book
            $http.post('/bookservice/add', book)
            .success(function(res) {
              if (res.result) {
                bookList.unshift({type:'detail', value: res.book});
              }
               done(res);
            });
          }else {
            $http.post('/bookservice/update', {id: book._id, title:book.title})
            .success(function(res) {
               if (res.result) {
                 bookList[i].value = res.book;
               }
               done(res);
            });
          }
       }
       
     }; 
   }
 ]);