var module = require('./module');

module.directive('editor', function () {
  return {
    restrict: 'EA',
    scope: true,
    replace: true,
    templateUrl: 'partials/editor-directive.html',
    compile: function compile ( tElement, tAttrs ) {
      console.log('editor compile');

      return function postLink ( scope, iElement, iAttrs, ngModel ) {
        console.log('editor postlink');

        scope.tab = 'code';
        scope.doubleMode = false;

        scope.editorOptions = {
          mode: 'markdown',
          lineWrapping: true,
          lineNumbers: true
        };

        console.log('scope', scope);

        scope.activateTab = function ( name ) {
          scope.tab = name;
        };

        scope.setDoubleMode = function ( value ) {
          scope.doubleMode = value;
        };

      };
    }
  };
});
