(function(window,angular){
	angular.module('app')
		//一级header
		.directive('headerDirective', ['$state', function($state){
			// Runs during compile
			return {
				// name: '',
				// priority: 1,
				// terminal: true,
				// scope: {}, // {} = isolate, true = child, false/undefined = no change
				// controller: function($scope, $element, $attrs, $transclude) {},
				// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
				restrict: 'EA', // E = Element, A = Attribute, C = Class, M = Comment
				// template: '',
				templateUrl: 'views/directive/headerDirective.html',
				// replace: true,
				// transclude: true,
				// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
				link: function($scope, iElm, iAttrs, controller) {
					$scope.stateName = $state.current.name;
						

					// console.log($scope.stateName);
				}
			};
		}])
		//二级header
		.directive('subHeaderDirctive', ['$state','$stateParams', function($state,$stateParams){
			// Runs during compile
			return {
				// name: '',
				// priority: 1,
				// terminal: true,
				// scope: {}, // {} = isolate, true = child, false/undefined = no change
				// controller: function($scope, $element, $attrs, $transclude) {},
				// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
				restrict: 'EA', // E = Element, A = Attribute, C = Class, M = Comment
				// template: '',
				templateUrl: 'views/directive/subHeaderDirective.html',
				// replace: true,
				// transclude: true,
				// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
				link: function($scope, iElm, iAttrs, controller) {
					// console.log($stateParams.source);
					if($stateParams.source == 'app'){
						$scope.subHeaderShow = false;
						console.log(1);
					}else{
						$scope.subHeaderShow = true;
					}

					// console.log($state.current.goHomeShow);
					if(angular.isUndefined($state.current.goHomeShow)){
						$scope.goIndexShow = true;
					}else if($state.current.goHomeShow == false){
						$scope.goIndexShow = false;
					}
					
					// if($stateParams.source == 'app'){

					// }
				}
			};
		}])
		.directive('detailMenuDirective', [function(){
			// Runs during compile
			return {
				// name: '',
				// priority: 1,
				// terminal: true,
				// scope: {}, // {} = isolate, true = child, false/undefined = no change
				// controller: function($scope, $element, $attrs, $transclude) {},
				// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
				restrict: 'EA', // E = Element, A = Attribute, C = Class, M = Comment
				// template: '',
				templateUrl: 'views/directive/detailMenuDirective.html',
				// replace: true,
				// transclude: true,
				// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
				link: function($scope, iElm, iAttrs, controller) {
					
				}
			};
		}])
		//购物车
		.directive('cartDirective', [function(){
			// Runs during compile
			return {
				// name: '',
				// priority: 1,
				// terminal: true,
				// scope: {}, // {} = isolate, true = child, false/undefined = no change
				// controller: function($scope, $element, $attrs, $transclude) {},
				// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
				restrict: 'EA', // E = Element, A = Attribute, C = Class, M = Comment
				// template: '',
				templateUrl: 'views/directive/cartDirective.html',
				// replace: true,
				// transclude: true,
				// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
				link: function($scope, iElm, iAttrs, controller) {
					
				}
			};
		}])
		//购物车
		.directive('loadingDirective', [function(){
			// Runs during compile
			return {
				// name: '',
				// priority: 1,
				// terminal: true,
				// scope: {}, // {} = isolate, true = child, false/undefined = no change
				// controller: function($scope, $element, $attrs, $transclude) {},
				// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
				restrict: 'EA', // E = Element, A = Attribute, C = Class, M = Comment
				// template: '',
				templateUrl: 'views/directive/loadingDirective.html',
				// replace: true,
				// transclude: true,
				// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
				link: function($scope, iElm, iAttrs, controller) {
					$scope.loading = true;
					$scope.nomore = false;
					$scope.no = false;
				}
			};
		}]);
		
})(window,angular);