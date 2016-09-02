(function(window,angular){
	angular.module('app')
		//一级header
		.directive('footerDirective', ['$state', function($state){
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
				templateUrl: 'views/directive/footerDirective.html',
				// replace: true,
				// transclude: true,
				// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
				link: function($scope, iElm, iAttrs, controller) {
						$scope.gohome=function(){
							console.log('index');
							location.href="index.html#index"
						}
						$scope.gogame=function(){
							console.log('gamelistCtrl');
							location.href="index.html#gamelist"
						}
						$scope.gokf=function(){
							console.log('kf');
							location.href="index.html#kf"
						}
						$scope.gomy=function(){
							console.log('myhome');
							location.href="index.html#myhome"
						}
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
					
					$scope.goBack = function(){
							history.go(-1);
					}
					
					// if($stateParams.source == 'app'){

					// }
				}
			};
		}])
		.directive('kfboxDirective', [function(){
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
				templateUrl: 'views/directive/kfboxDirective.html',
				// replace: true,
				// transclude: true,
				// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
				link: function($scope, iElm, iAttrs, controller) {
					$scope.tiphide=function(){
						$scope.tipShow=false;
						console.log($scope.tipShow);
					}
				}
			};
		}])
		.directive('uploadpicDirective', [function(){
			// Runs during compile
			return {
				// name: '',
				// priority: 1,
				// terminal: true,
				 //scope:true, // {} = isolate, true = child, false/undefined = no change
				// controller: function($scope, $element, $attrs, $transclude) {},
				// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
				restrict: 'EA', // E = Element, A = Attribute, C = Class, M = Comment
				// template: '',
				templateUrl: 'views/directive/uploadpicDirective.html',
				// replace: true,
				// transclude: true,
				// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
				link: function($scope, iElm, iAttrs, controller) {
					$scope.img=$scope.playInfo.PicUrl;
					$scope.UpLoadPic=function(){
						document.querySelector('#localfile').click();
					}
					$scope.fileNameChanged=function(sender){
						$scope.img=document.querySelector('#localfile').value;
						var objPreview = document.getElementById('img_src'); 
						if( !sender.value.match( /.jpg|.jpeg|.gif|.png|.bmp/i ) ){ 
								console.log('图片格式无效！'); 
								return false; 
						}
						if( sender.files && sender.files[0] ){ //这里面就是chrome和ff可以兼容的了 
							// Firefox 因安全性问题已无法直接通过 input[file].value 获取完整的文件路径 
							objPreview.src = window.URL.createObjectURL(sender.files[0]);
							//objPreview.src = sender.files[0].getAsDataURL(); 
						}
						
						
						
						//objPreview.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = imgSrc; 
						
					}
					
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