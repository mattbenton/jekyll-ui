var module = require('./module');

module.directive('uiCodemirror', function () {
  return {
    restrict: 'EA',
    require: '?ngModel',
    priority: 1,
    compile: function compile ( tElement, tAttrs ) {
      if ( angular.isUndefined(window.CodeMirror) ) {
        throw new Error('ui-codmirror needs CodeMirror to work!');
      }

      var initialValue = tElement.text();
      var codeMirror = new window.CodeMirror(function ( codeMirrorEl ) {
        console.log(codeMirrorEl);
        tElement.replaceWith(codeMirrorEl);
      }, {
        value: initialValue
      });

      console.log('compile');

      return function postLink ( scope, iElement, iAttrs, ngModel ) {
        console.log('postlink');
        var opts = angular.extend({}, scope.$eval(iAttrs.uiCodemirror));

        function updateOptions ( options ) {
          for ( var key in options ) {
            if ( options.hasOwnProperty(key) ) {
              codeMirror.setOption(key, options[key]);
            }
          }
        }

        updateOptions(opts);

        function updateModel ( newValue ) {
          if ( ngModel && newValue !== ngModel.$viewValue ) {
            ngModel.$setViewValue(newValue);

            if ( !scope.$$phase ) {
              scope.$apply();
            }
          }
        }

        codeMirror.on('change', function ( instance ) {
          updateModel(instance.getValue());
        });

        if ( ngModel ) {
          ngModel.$formatters.push(function ( value ) {
            if ( angular.isUndefined(value) || value === null ) {
              return '';
            } else if ( angular.isObject(value) || angular.isArray(value) ) {
              throw new Error('ui-codemirror cannot use an object or an array as a model');
            }
            return value;
          });

          ngModel.$render = function () {
            codeMirror.setValue(ngModel.$viewValue || '');
          };

          updateModel(initialValue);
        }
      };
    }
  };
});
