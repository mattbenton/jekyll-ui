var module = require('./module');

module.directive('markdown', function () {
  return {
    restrict: 'EA',
    require: '?ngModel',
    priority: 1,
    compile: function compile ( tElement, tAttrs ) {
      if ( !window.markdown ) {
        throw new Error('markdown needs markdown to work!');
      }

      var initialValue = tElement.text();

      return function postLink ( scope, iElement, iAttrs, ngModel ) {
        function updateModel ( newValue ) {
          if ( ngModel && newValue !== ngModel.$viewValue ) {
            ngModel.$setViewValue(newValue);

            if ( !scope.$$phase ) {
              scope.$apply();
            }
          }
        }

        if ( ngModel ) {
          ngModel.$render = function () {
            tElement.html(window.markdown.toHTML(ngModel.$viewValue || ''));
          }

          updateModel(initialValue);
        }
      };
    }
  };
});
