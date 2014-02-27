var module = angular.module('app.services', []);

module.service('PostService', ['$http', '$q', function ( $http, $q ) {

  this.getPosts = function () {
    return $http.get('/api/posts');
  };

  this.getPost = function ( file ) {
    return $http.get('/api/post/' + file);
  };

}]);
