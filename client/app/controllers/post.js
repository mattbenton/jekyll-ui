var module = require('./module');

module.controller('PostCtrl', ['$scope', function ( $scope ) {
  $scope.editorOptions = {
    mode: 'markdown',
    lineWrapping: true,
    lineNumbers: true
  };
}]);
