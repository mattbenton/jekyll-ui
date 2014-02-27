// var el = document.getElementById("editor");
// var editor = CodeMirror.fromTextArea(el, {
//   mode: 'markdown'
// });

// var updatePreview = _.debounce(function ( instance, changeObj ) {
//   var el = document.getElementById('preview');
//   el.innerHTML = markdown.toHTML(instance.getValue());
// }, 150);

// editor.on('change', updatePreview);

var app = angular.module('app', [
  'ngRoute',
  'app.services',
  'app.directives',
  'app.controllers'
]);

app.config(['$routeProvider', '$locationProvider', function ( $routeProvider, $locationProvider ) {
  $routeProvider
    // .when('/', {
    //   templateUrl: 'partials/main.html',
    //   controller: 'MainCtrl'
    // })
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

app.controller('MainCtrl', ['$scope', function ( $scope ) {

}]);

app.controller('EditorCtrl', ['$scope', 'EditorService', function ( $scope, EditorService ) {
  $scope.name = "matt";
  $scope.EditorService = EditorService;

  EditorService.getPosts().success(function ( res ) {
    $scope.posts = res.posts;
  })
}]);

app.controller('EditorCtrl2', ['$scope', 'EditorService', function ( $scope, EditorService ) {
  $scope.name = "bob";
  $scope.EditorService = EditorService;
}]);

app.service('EditorService', ['$http', '$q', function ( $http, $q ) {

  var age = 2;

  this.getPosts = function () {
    return $http.get('/api/posts');
  };

  this.loadPost = function ( file ) {
    return $http.get('/api/post/' + file);
  };

}]);
