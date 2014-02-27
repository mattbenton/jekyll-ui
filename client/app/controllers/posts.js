var module = require('./module');

module.controller('PostsCtrl', ['$scope', 'Post', function ( $scope, Post ) {
  Post.getPosts()
    .success(function ( res ) {
      $scope.posts = res.posts;
    });
}]);
