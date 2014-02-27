var module = angular.module('app.controllers', []);

module.controller('PostsCtrl', ['$scope', 'PostService', function ( $scope, PostService ) {
  PostService.getPosts()
    .success(function ( res ) {
      $scope.posts = res.posts;
    });
}]);

module.controller('PostCtrl', ['$scope', '$routeParams', 'PostService', '$timeout', function ( $scope, $routeParams, PostService, $timeout ) {

  $scope.editorOptions = {
    mode: 'markdown',
    lineWrapping: true,
    lineNumbers: true
  };

  return;
  var el = document.getElementById("editor");
  var editor = CodeMirror.fromTextArea(el, {
    mode: 'markdown',
    lineWrapping: true
  });

  var $window = $(window);

  $scope.editorDouble = true;
  $scope.isEditing = true;

  var $preview = $('#preview');

  var updateEditor = _.debounce(function(){
    $timeout(function(){
      $scope.editorDouble = ($window.width() >= 992);

      var height = $window.height() - 85;

      if ( !$scope.editorDouble ) {
        height -= 32;
      }

      $('.CodeMirror, .editor-preview').css('height', height);
    });
  });

  updateEditor();

  var updatePreview = _.debounce(function ( instance, changeObj ) {
    var el = document.getElementById('preview');
    el.innerHTML = markdown.toHTML(instance.getValue());
  }, 150);

  // var syncPreviewScroll = _.throttle(function ( cm, from, to ) {
  var syncPreviewScroll = function ( cm, from, to ) {
    var info = cm.getScrollInfo();

    var percentage = info.top / info.height;
    // console.log(info, percentage);

    var scrollTop = $preview.prop('scrollTop');
    var scrollHeight = $preview.prop('scrollHeight');
    var newScollTop = scrollHeight * percentage;
    var dy = Math.abs(scrollTop - newScollTop);
    var speed = Math.max(10, 400 - dy);

    // $preview.stop().animate({
    //   scrollTop: newScollTop
    // }, speed);
    $preview.scrollTop(newScollTop);
  };

  editor.on('scroll', syncPreviewScroll);
  editor.on('change', updatePreview);

  $window.on('resize', updateEditor);

  $scope.params = $routeParams;

  $scope.inputTab = function () {
    if ( !$scope.editorDouble ) {
      $scope.isEditing = true;
    }
  };

  $scope.previewTab = function () {
    if ( !$scope.editorDouble ) {
      $scope.isEditing = false;
    }
  };

  $scope.bold = function () {

    if ( editor.somethingSelected() ) {
      editor.replaceSelection('**' + editor.getSelection() + '**');
    } else {

    }

    // var cursor = editor.getCursor();
    // console.log(cursor);

    // var from = { line: 3, ch: 21 };
    // var to = { line: 3, ch: 25 };

    // var text = editor.getRange(from, to);
    // editor.replaceRange('**' + text + '**', from, to);
  };

  PostService.getPost($routeParams.file)
    .success(function ( res ) {
      // $('.editor .inner').html(res.post.content);
      // console.log(res);
      editor.setValue(res.post.content);
    });
}]);
