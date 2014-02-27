(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = angular.module('app.controllers', []);

},{}],2:[function(require,module,exports){
var module = require('./module');

module.controller('PostCtrl', ['$scope', function ( $scope ) {
  $scope.editorOptions = {
    mode: 'markdown',
    lineWrapping: true,
    lineNumbers: true
  };
}]);

},{"./module":1}],3:[function(require,module,exports){
var module = require('./module');

module.controller('PostsCtrl', ['$scope', 'Post', function ( $scope, Post ) {
  Post.getPosts()
    .success(function ( res ) {
      $scope.posts = res.posts;
    });
}]);

},{"./module":1}],4:[function(require,module,exports){
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

},{"./module":6}],5:[function(require,module,exports){
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

},{"./module":6}],6:[function(require,module,exports){
module.exports = angular.module('app.directives', []);

},{}],7:[function(require,module,exports){
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

},{"./controllers/post":2,"./controllers/posts":3,"./directives/codemirror":4,"./directives/markdown":5,"./services/post":9}],8:[function(require,module,exports){
module.exports = angular.module('app.services', []);

},{}],9:[function(require,module,exports){
var module = require('./module');

module.service('Post', ['$http', function ( $http ) {

  this.getPosts = function () {
    return $http.get('/api/posts');
  };

  this.getPost = function ( file ) {
    return $http.get('/api/post/' + file);
  };

}]);

},{"./module":8}]},{},[7])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvbWF0dC9naXRodWIvamVreWxsLXVpL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9tYXR0L2dpdGh1Yi9qZWt5bGwtdWkvY2xpZW50L2FwcC9jb250cm9sbGVycy9tb2R1bGUuanMiLCIvVXNlcnMvbWF0dC9naXRodWIvamVreWxsLXVpL2NsaWVudC9hcHAvY29udHJvbGxlcnMvcG9zdC5qcyIsIi9Vc2Vycy9tYXR0L2dpdGh1Yi9qZWt5bGwtdWkvY2xpZW50L2FwcC9jb250cm9sbGVycy9wb3N0cy5qcyIsIi9Vc2Vycy9tYXR0L2dpdGh1Yi9qZWt5bGwtdWkvY2xpZW50L2FwcC9kaXJlY3RpdmVzL2NvZGVtaXJyb3IuanMiLCIvVXNlcnMvbWF0dC9naXRodWIvamVreWxsLXVpL2NsaWVudC9hcHAvZGlyZWN0aXZlcy9tYXJrZG93bi5qcyIsIi9Vc2Vycy9tYXR0L2dpdGh1Yi9qZWt5bGwtdWkvY2xpZW50L2FwcC9kaXJlY3RpdmVzL21vZHVsZS5qcyIsIi9Vc2Vycy9tYXR0L2dpdGh1Yi9qZWt5bGwtdWkvY2xpZW50L2FwcC9mYWtlXzhmYzIzMjVmLmpzIiwiL1VzZXJzL21hdHQvZ2l0aHViL2pla3lsbC11aS9jbGllbnQvYXBwL3NlcnZpY2VzL21vZHVsZS5qcyIsIi9Vc2Vycy9tYXR0L2dpdGh1Yi9qZWt5bGwtdWkvY2xpZW50L2FwcC9zZXJ2aWNlcy9wb3N0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdhcHAuY29udHJvbGxlcnMnLCBbXSk7XG4iLCJ2YXIgbW9kdWxlID0gcmVxdWlyZSgnLi9tb2R1bGUnKTtcblxubW9kdWxlLmNvbnRyb2xsZXIoJ1Bvc3RDdHJsJywgWyckc2NvcGUnLCBmdW5jdGlvbiAoICRzY29wZSApIHtcbiAgJHNjb3BlLmVkaXRvck9wdGlvbnMgPSB7XG4gICAgbW9kZTogJ21hcmtkb3duJyxcbiAgICBsaW5lV3JhcHBpbmc6IHRydWUsXG4gICAgbGluZU51bWJlcnM6IHRydWVcbiAgfTtcbn1dKTtcbiIsInZhciBtb2R1bGUgPSByZXF1aXJlKCcuL21vZHVsZScpO1xuXG5tb2R1bGUuY29udHJvbGxlcignUG9zdHNDdHJsJywgWyckc2NvcGUnLCAnUG9zdCcsIGZ1bmN0aW9uICggJHNjb3BlLCBQb3N0ICkge1xuICBQb3N0LmdldFBvc3RzKClcbiAgICAuc3VjY2VzcyhmdW5jdGlvbiAoIHJlcyApIHtcbiAgICAgICRzY29wZS5wb3N0cyA9IHJlcy5wb3N0cztcbiAgICB9KTtcbn1dKTtcbiIsInZhciBtb2R1bGUgPSByZXF1aXJlKCcuL21vZHVsZScpO1xuXG5tb2R1bGUuZGlyZWN0aXZlKCd1aUNvZGVtaXJyb3InLCBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFQScsXG4gICAgcmVxdWlyZTogJz9uZ01vZGVsJyxcbiAgICBwcmlvcml0eTogMSxcbiAgICBjb21waWxlOiBmdW5jdGlvbiBjb21waWxlICggdEVsZW1lbnQsIHRBdHRycyApIHtcbiAgICAgIGlmICggYW5ndWxhci5pc1VuZGVmaW5lZCh3aW5kb3cuQ29kZU1pcnJvcikgKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigndWktY29kbWlycm9yIG5lZWRzIENvZGVNaXJyb3IgdG8gd29yayEnKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGluaXRpYWxWYWx1ZSA9IHRFbGVtZW50LnRleHQoKTtcbiAgICAgIHZhciBjb2RlTWlycm9yID0gbmV3IHdpbmRvdy5Db2RlTWlycm9yKGZ1bmN0aW9uICggY29kZU1pcnJvckVsICkge1xuICAgICAgICBjb25zb2xlLmxvZyhjb2RlTWlycm9yRWwpO1xuICAgICAgICB0RWxlbWVudC5yZXBsYWNlV2l0aChjb2RlTWlycm9yRWwpO1xuICAgICAgfSwge1xuICAgICAgICB2YWx1ZTogaW5pdGlhbFZhbHVlXG4gICAgICB9KTtcblxuICAgICAgY29uc29sZS5sb2coJ2NvbXBpbGUnKTtcblxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIHBvc3RMaW5rICggc2NvcGUsIGlFbGVtZW50LCBpQXR0cnMsIG5nTW9kZWwgKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdwb3N0bGluaycpO1xuICAgICAgICB2YXIgb3B0cyA9IGFuZ3VsYXIuZXh0ZW5kKHt9LCBzY29wZS4kZXZhbChpQXR0cnMudWlDb2RlbWlycm9yKSk7XG5cbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlT3B0aW9ucyAoIG9wdGlvbnMgKSB7XG4gICAgICAgICAgZm9yICggdmFyIGtleSBpbiBvcHRpb25zICkge1xuICAgICAgICAgICAgaWYgKCBvcHRpb25zLmhhc093blByb3BlcnR5KGtleSkgKSB7XG4gICAgICAgICAgICAgIGNvZGVNaXJyb3Iuc2V0T3B0aW9uKGtleSwgb3B0aW9uc1trZXldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB1cGRhdGVPcHRpb25zKG9wdHMpO1xuXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZU1vZGVsICggbmV3VmFsdWUgKSB7XG4gICAgICAgICAgaWYgKCBuZ01vZGVsICYmIG5ld1ZhbHVlICE9PSBuZ01vZGVsLiR2aWV3VmFsdWUgKSB7XG4gICAgICAgICAgICBuZ01vZGVsLiRzZXRWaWV3VmFsdWUobmV3VmFsdWUpO1xuXG4gICAgICAgICAgICBpZiAoICFzY29wZS4kJHBoYXNlICkge1xuICAgICAgICAgICAgICBzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb2RlTWlycm9yLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbiAoIGluc3RhbmNlICkge1xuICAgICAgICAgIHVwZGF0ZU1vZGVsKGluc3RhbmNlLmdldFZhbHVlKCkpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIG5nTW9kZWwgKSB7XG4gICAgICAgICAgbmdNb2RlbC4kZm9ybWF0dGVycy5wdXNoKGZ1bmN0aW9uICggdmFsdWUgKSB7XG4gICAgICAgICAgICBpZiAoIGFuZ3VsYXIuaXNVbmRlZmluZWQodmFsdWUpIHx8IHZhbHVlID09PSBudWxsICkge1xuICAgICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBhbmd1bGFyLmlzT2JqZWN0KHZhbHVlKSB8fCBhbmd1bGFyLmlzQXJyYXkodmFsdWUpICkge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3VpLWNvZGVtaXJyb3IgY2Fubm90IHVzZSBhbiBvYmplY3Qgb3IgYW4gYXJyYXkgYXMgYSBtb2RlbCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgbmdNb2RlbC4kcmVuZGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29kZU1pcnJvci5zZXRWYWx1ZShuZ01vZGVsLiR2aWV3VmFsdWUgfHwgJycpO1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICB1cGRhdGVNb2RlbChpbml0aWFsVmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcbn0pO1xuIiwidmFyIG1vZHVsZSA9IHJlcXVpcmUoJy4vbW9kdWxlJyk7XG5cbm1vZHVsZS5kaXJlY3RpdmUoJ21hcmtkb3duJywgZnVuY3Rpb24gKCkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRUEnLFxuICAgIHJlcXVpcmU6ICc/bmdNb2RlbCcsXG4gICAgcHJpb3JpdHk6IDEsXG4gICAgY29tcGlsZTogZnVuY3Rpb24gY29tcGlsZSAoIHRFbGVtZW50LCB0QXR0cnMgKSB7XG4gICAgICBpZiAoICF3aW5kb3cubWFya2Rvd24gKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbWFya2Rvd24gbmVlZHMgbWFya2Rvd24gdG8gd29yayEnKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGluaXRpYWxWYWx1ZSA9IHRFbGVtZW50LnRleHQoKTtcblxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIHBvc3RMaW5rICggc2NvcGUsIGlFbGVtZW50LCBpQXR0cnMsIG5nTW9kZWwgKSB7XG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZU1vZGVsICggbmV3VmFsdWUgKSB7XG4gICAgICAgICAgaWYgKCBuZ01vZGVsICYmIG5ld1ZhbHVlICE9PSBuZ01vZGVsLiR2aWV3VmFsdWUgKSB7XG4gICAgICAgICAgICBuZ01vZGVsLiRzZXRWaWV3VmFsdWUobmV3VmFsdWUpO1xuXG4gICAgICAgICAgICBpZiAoICFzY29wZS4kJHBoYXNlICkge1xuICAgICAgICAgICAgICBzY29wZS4kYXBwbHkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIG5nTW9kZWwgKSB7XG4gICAgICAgICAgbmdNb2RlbC4kcmVuZGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdEVsZW1lbnQuaHRtbCh3aW5kb3cubWFya2Rvd24udG9IVE1MKG5nTW9kZWwuJHZpZXdWYWx1ZSB8fCAnJykpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHVwZGF0ZU1vZGVsKGluaXRpYWxWYWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICB9O1xufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXIubW9kdWxlKCdhcHAuZGlyZWN0aXZlcycsIFtdKTtcbiIsInZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJywgW1xuICAnbmdSb3V0ZScsXG4gICdhcHAuc2VydmljZXMnLFxuICAnYXBwLmRpcmVjdGl2ZXMnLFxuICAnYXBwLmNvbnRyb2xsZXJzJ1xuXSk7XG5cbmFwcC5jb25maWcoWyckcm91dGVQcm92aWRlcicsICckbG9jYXRpb25Qcm92aWRlcicsIGZ1bmN0aW9uICggJHJvdXRlUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyICkge1xuICAkcm91dGVQcm92aWRlclxuICAgIC53aGVuKCcvcG9zdHMnLCB7XG4gICAgICB0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL3Bvc3RzLmh0bWwnLFxuICAgICAgY29udHJvbGxlcjogJ1Bvc3RzQ3RybCdcbiAgICB9KVxuICAgIC53aGVuKCcvcG9zdC86ZmlsZScsIHtcbiAgICAgIHRlbXBsYXRlVXJsOiAncGFydGlhbHMvcG9zdC5odG1sJyxcbiAgICAgIGNvbnRyb2xsZXI6ICdQb3N0Q3RybCdcbiAgICB9KVxuICAgIC5vdGhlcndpc2Uoe1xuICAgICAgcmVkaXJlY3RUbzogJy9wb3N0cydcbiAgICB9KTtcblxuICAkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUoZmFsc2UpO1xufV0pO1xuXG5yZXF1aXJlKCcuL3NlcnZpY2VzL3Bvc3QnKTtcblxucmVxdWlyZSgnLi9kaXJlY3RpdmVzL2NvZGVtaXJyb3InKTtcbnJlcXVpcmUoJy4vZGlyZWN0aXZlcy9tYXJrZG93bicpO1xuXG5yZXF1aXJlKCcuL2NvbnRyb2xsZXJzL3Bvc3QnKTtcbnJlcXVpcmUoJy4vY29udHJvbGxlcnMvcG9zdHMnKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gYW5ndWxhci5tb2R1bGUoJ2FwcC5zZXJ2aWNlcycsIFtdKTtcbiIsInZhciBtb2R1bGUgPSByZXF1aXJlKCcuL21vZHVsZScpO1xuXG5tb2R1bGUuc2VydmljZSgnUG9zdCcsIFsnJGh0dHAnLCBmdW5jdGlvbiAoICRodHRwICkge1xuXG4gIHRoaXMuZ2V0UG9zdHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICRodHRwLmdldCgnL2FwaS9wb3N0cycpO1xuICB9O1xuXG4gIHRoaXMuZ2V0UG9zdCA9IGZ1bmN0aW9uICggZmlsZSApIHtcbiAgICByZXR1cm4gJGh0dHAuZ2V0KCcvYXBpL3Bvc3QvJyArIGZpbGUpO1xuICB9O1xuXG59XSk7XG4iXX0=
