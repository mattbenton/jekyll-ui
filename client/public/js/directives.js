var module = angular.module('app.directives', []);

module.directive('editor', function () {
  return {
    restrict: 'A',
    templateUrl: 'partials/editor-directive.html',
    link: function ( scope, element, attrs ) {
      console.log('link');
    }
  };
});

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

module.constant('uiCodemirrorConfig', {});

module.directive('uiCodemirror', ['uiCodemirrorConfig', function ( uiCodemirrorConfig ) {
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
        var defaultOptions = uiCodemirrorConfig || {};
        var opts = angular.extend({}, defaultOptions, scope.$eval(iAttrs.uiCodemirror));

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
}]);
