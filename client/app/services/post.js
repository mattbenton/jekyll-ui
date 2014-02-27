var module = require('./module');

module.service('Post', ['$http', function ( $http ) {

  this.getPosts = function () {
    return $http.get('/api/posts');
  };

  this.getPost = function ( file ) {
    return $http.get('/api/post/' + file);
  };

}]);
