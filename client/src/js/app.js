var markdown = require('markdown').markdown;
var _ = require('underscore');

var el = document.getElementById("code");
var editor = CodeMirror.fromTextArea(el, {
  mode: 'markdown',
  lineNumbers: false,
//  theme: 'solarized'
});

var updatePreview = _.debounce(function ( instance, changeObj ) {
  var el = document.getElementById('preview');
  el.innerHTML = markdown.toHTML(instance.getValue());
}, 150);

editor.on('change', updatePreview);

var app = angular.module('myApp', ['ngResource']);

app.controller('EditorCtrl', ['$scope', 'EditorProvider', function ( $scope, EditorProvider ) {
  $scope.editor = EditorProvider;
}]);

app.factory('EditorProvider', ['PostsProvider', '$timeout', function ( PostsProvider, $timeout ) {
  function EditorProvider () {
    this.file = null;
  }

  EditorProvider.prototype.load = function ( file ) {
    var self = this;
    PostsProvider
      .getPost(file)
      .success(function ( res ) {
        $timeout(function () {
          self.file = file;
          self.content = res.content;

          editor.setValue(res.content);
        });
      });
  };

  return new EditorProvider();
}]);

app.controller('PostsCtrl', ['$scope', 'PostsProvider', 'EditorProvider', function ( $scope, PostsProvider, EditorProvider ) {
  PostsProvider
    .getPosts()
    .success(function ( res ) {
      $scope.posts = res.posts;
    });

  $scope.loadPost = function ( post ) {
    EditorProvider.load(post.file);
  };
}]);

app.factory('PostsProvider', ['$http', '$q', function ( $http, $q ) {

  function PostsProvider () {
    this.name = 'PostsProvider';
  }

  PostsProvider.prototype.getPosts = function () {
    return $http.get('/api/posts');
  };

  PostsProvider.prototype.getPost = function ( file ) {
    return $http.get('/api/post/' + file);
  };

  return new PostsProvider();

}]);

