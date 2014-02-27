var module = require('./module');

module.controller('TestCtrl', ['$scope', function ( $scope ) {
  $scope.name = 'Angular!';
}]);
