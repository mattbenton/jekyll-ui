var app = angular.module('app', [
  'ngRoute',
  'app.services',
  'app.directives',
  'app.controllers'
]);

app.config(['$routeProvider', '$locationProvider', function ( $routeProvider, $locationProvider ) {
  $routeProvider
    .when('/posts', {
      templateUrl: 'partials/posts.html',
      controller: 'PostsCtrl'
    })
    .when('/post/:file', {
      templateUrl: 'partials/post.html',
      controller: 'PostCtrl'
    })
    .otherwise({
      redirectTo: '/posts'
    });

  $locationProvider.html5Mode(false);
}]);

require('./services/post');

require('./directives/codemirror');
require('./directives/markdown');

require('./controllers/post');
require('./controllers/posts');
