(function(window, angular) {
	angular.module('app')
		//首页
		.controller('indexCtrl', ['$scope', '$rootScope', 'API', 'lyer', 'userInfo', 'countDown', 'isBindCard', function($scope, $rootScope, API, lyer, userInfo, countDown, isBindCard) {
			$rootScope.body_class = "index_bg";
			console.log($rootScope.isLogin);
			$scope.footerShow = true;
			$rootScope.IsBindBank = false;
			$scope.titleShow = true;
			$scope.tipShow = false;

			$scope.swiper = function() {
				var mySwiper = new Swiper('.swiper-container', {
					autoplay: 3000, //可选选项，自动滑动
					pagination: '.swiper-pagination',
				})
			}
			$scope.swiper();

			if($rootScope.isLogin) {
				setInterval(function() {
					//	api/yqsAssistant/Assistant/?id=1
					var params = {
						'id': userInfo.get().UId
					};
					//秘书提醒功能
					API.qtInt('/api/yqsAssistant/Assistant/', params)
						.success(function(rt) {
							rt = angular.fromJson(rt)
							if(rt.Code == 0) {
								$scope.tipShow = true;
								console.log('$scope.tipShow=' + $scope.tipShow);
								$scope.$apply(); //重置
								$scope.data = rt.Data;
							} else {
								return false;
							}
						});
				}, 30000)
			}

			//未登录 跳转到 登陆页

			if(!$rootScope.isLogin) {
				location.href = "index.html#login";
				console.log($rootScope.isLogin);
				return false;
			}
			//判断用户是否绑定
			isBindCard();
			if(!$rootScope.IsBindBank) {
				console.log("去绑定银行卡");
				location.href = "index.html#bankcard";
				return false;
			}
			// console.log(API);
			var bannerParams = {
					action: 2005,
					params: angular.toJson({
						btype: 0
					})
				}
				//首页轮播图
				//			API.ucInt(bannerParams)
				//				.success(function(rt){
				//					// console.log(rt);
				//					if(rt.Code == 0){
				//						$scope.banner = rt.Data.list;
				//
				//						setTimeout(function(){
				//							var mySwiper = new Swiper('.swiper-container', {
				//								autoplay: 3000,//可选选项，自动滑动
				//								pagination : '.swiper-pagination',
				//							})
				//						},50);
				//					}
				//				});

		}])
		//注册
		.controller('registerCtrl', ['$scope', '$rootScope', 'API', 'lyer', 'md5', function($scope, $rootScope, API, lyer, md5) {
			$rootScope.body_class = "login_bg";
			$scope.titleShow = true;
			$scope.params = {};
			$scope.isRegister = false;
			$scope.zhuce = function() {

				console.log('register');
				console.log($scope.params)
				if($scope.registerForm.name.$error.required || $scope.registerForm.pwd.$error.required || $scope.registerForm.tel.$error.required || $scope.registerForm.reference.$error.required || $scope.registerForm.referencetel.$error.required) {
					lyer.msg('不能为空');
					return false;
				}
				if($scope.params.pwd != $scope.params.repwd) {
					lyer.msg('两次密码不一致');
					return false;
				} else if($scope.registerForm.name.$error.pattern || $scope.registerForm.pwd.$error.pattern || $scope.registerForm.tel.$error.pattern || $scope.registerForm.reference.$error.pattern || $scope.registerForm.referencetel.$error.pattern) {
					lyer.msg('请正确输入');
					return false;
				}

				$scope.isRegister = true;

				$scope.params.pwd = md5.createHash($scope.params.pwd + 'Q56GtyNkop97H334TtyturfgErvvv98r' || '');
				$scope.params.repwd = md5.createHash($scope.params.repwd + 'Q56GtyNkop97H334TtyturfgErvvv98r' || '');

				var params = angular.extend({}, $scope.params);

				//提交表单注册 ;
				API.qtInt('/api/yqsuser/Register/', params)
					.success(function(rt) {
						rt = angular.fromJson(rt)
						if(rt.Code == 0) {

							$scope.data = rt.Data;
							lyer.msg('注册成功', function() {
								location.href = "index.html#login";
							});

						} else {
							lyer.msg('注册格式有误，请先检查');
							return false;
						}
					});

			}

		}])
		//登陆
		.controller('loginCtrl', ['$scope', '$rootScope', 'API', 'lyer', 'userInfo', 'md5', function($scope, $rootScope, API, lyer, userInfo, md5) {
			$rootScope.body_class = "login_bg";
			$scope.titleShow = true;
			console.log('login');
			$scope.params = {};
			$scope.login = function() {

				if($scope.loginForm.name.$error.required) {
					lyer.msg('请输入手机号码');
					return false;
				} else if($scope.loginForm.name.$error.pattern) {
					lyer.msg('请输入正确的手机号码');
					return false;
				}

				$scope.params.pwd = md5.createHash($scope.params.pwd + 'Q56GtyNkop97H334TtyturfgErvvv98r' || '');
				var params = angular.extend({}, $scope.params);
				//提交表单登陆 ;
				API.qtInt('/api/yqsuser/Login/', params)
					.success(function(rt) {
						rt = angular.fromJson(rt)

						if(rt.Code == 0) {

							$scope.data = rt.Data;
							userInfo.set(rt.Data);
							location.href = "index.html#index";
						} else {
							lyer.msg(rt.Msg);
						}
					});

			}

		}])
		//绑定银行卡
		.controller('bankcardCtrl', ['$scope', '$rootScope', 'API', 'lyer', 'userInfo', 'md5', function($scope, $rootScope, API, lyer, userInfo, md5) {
			$rootScope.body_class = "login_bg";
			$scope.titleShow = true;
			$scope.params = {};
			$scope.isbindcard = false;
			$scope.bindCard = function() {

				console.log('bindCard');
				console.log(userInfo.get().UId);
				if($scope.registerForm.realname.$error.required || $scope.registerForm.cardid.$error.required || $scope.registerForm.cardtype.$error.required || $scope.registerForm.cardaddress.$error.required || $scope.registerForm.alipayid.$error.required) {
					lyer.msg('不能为空');
					return false;
				} else if($scope.registerForm.realname.$error.pattern || $scope.registerForm.cardid.$error.pattern || $scope.registerForm.cardtype.$error.pattern || $scope.registerForm.cardaddress.$error.pattern || $scope.registerForm.alipayid.$error.pattern) {
					lyer.msg('请正确输入');
					return false;
				}

				//$scope.isbindcard=false;
				var params = angular.extend({
					'uid': userInfo.get().UId
				}, $scope.params);
				console.log(params);
				//提交银行卡绑定 ;
				API.qtInt('/api/yqsuser/BandCard/', params)
					.success(function(rt) {
						rt = angular.fromJson(rt)
						if(rt.Code == 0) {

							$scope.data = rt.Data;
							　userInfo.set(rt.Data);
							lyer.msg('绑定成功',function(){
								location.href = "index.html#index";
							});
							
						} else {
							lyer.msg(rt.Msg);
							return false;
						}
					});

			}

		}])

	//游戏选择
	.controller('gamelistCtrl', ['$scope', '$rootScope', '$state', 'lyer', 'unlogin', function($scope, $rootScope, $state, lyer, unlogin) {
		// unlogin($scope);
		$rootScope.body_class = "gamelist_bg";
		console.log($rootScope.isLogin);
		$scope.footerShow = true;
		$scope.titleShow = true;
		$scope.tipShow = false;
		if(!$rootScope.isLogin) {
			location.href = "index.html#login";
			console.log($rootScope.isLogin);
			return false;
		}

		$scope.$on('unlogin', unlogin);
		// 	if(angular.isObject(data.data) && data.data.Code == -2){
		// 		lyer.msg(data.data.Msg,function(){
		// 			$state.go('login');
		// 		})
		// 		return false;
		// 	}else if(angular.isObject(data.data) && (data.data.Code != -2 || data.data.Code !=0)){
		// 		lyer.msg(data.data.Msg);
		// 	}
		// })
	}])

	.controller('myhomeCtrl', ['$scope', '$rootScope', '$state', 'lyer', 'unlogin', function($scope, $rootScope, $state, lyer, unlogin) {
		// unlogin($scope);
		$rootScope.body_class = "myhone_bg";
		$scope.footerShow = true;
		$scope.titleShow = true;
		$scope.$on('unlogin', unlogin);
		// 	if(angular.isObject(data.data) && data.data.Code == -2){
		// 		lyer.msg(data.data.Msg,function(){
		// 			$state.go('login');
		// 		})
		// 		return false;
		// 	}else if(angular.isObject(data.data) && (data.data.Code != -2 || data.data.Code !=0)){
		// 		lyer.msg(data.data.Msg);
		// 	}
		// })
	}])

	.controller('kfCtrl', ['$scope', '$rootScope', '$state', 'lyer', 'unlogin', function($scope, $rootScope, $state, lyer, unlogin) {
		// unlogin($scope);
		$rootScope.body_class = "kf_bg";
		$scope.footerShow = true;
		$scope.titleShow = true;
		$scope.type=1;
		$scope.MyQuestion;
		
		if(!$rootScope.isLogin) {
			location.href = "index.html#login";
			console.log($rootScope.isLogin);
			return false;
		} else {
			
			
		}
		
	}])

	.controller('chuantongCtrl', ['$scope', '$rootScope', 'API', 'userInfo','playInfo', '$state', 'lyer', 'unlogin', function($scope, $rootScope, API,userInfo,playInfo, $state, lyer, unlogin) {
		$rootScope.body_class = "ct_game_bg";
		$scope.footerShow = true;
		$scope.titleShow = true;

		$scope.gzdialog = false;
		if(!$rootScope.isLogin) {
			location.href = "index.html#login";
			console.log($rootScope.isLogin);
			return false;
		} else {
				var params = {
				'uid': userInfo.get().UId,
				'playid': 1,
				'playcollection': userInfo.get().PlayCollection,
				'playstage': userInfo.get().PlayStage
			};
			API.qtInt('/api/yqsPlay/PlaySpeed/', params)
				.success(function(rt) {
					rt = angular.fromJson(rt)
					if(rt.Code == 0) {
						console.log(rt);
						playInfo.set(rt.Data);
					} else {
						return false;
					}
				});
		}
		$scope.playGame = function(PlayCollection, PlayStage) {
			
			$scope.PlayCollection=userInfo.get().PlayCollection;
			$scope.PlayStage=userInfo.get().PlayStage;
			//当前没有玩游戏
			if($scope.PlayCollection==0&&$scope.PlayStage==0){
				if(PlayCollection==1&&PlayStage==1){
					console.log("新建游戏");
					//新建游戏
			// api/yqsPlay/Play/?uid=1&playid=1&playcollection=1&playstage=1
			var params = {
				'uid': userInfo.get().UId,
				'playid': 1,
				'playcollection': PlayCollection,
				'playstage': PlayStage
			};

			API.qtInt('/api/yqsPlay/Play/', params)
				.success(function(rt) {
					rt = angular.fromJson(rt)
					if(rt.Code == 0) {
						console.log(rt);
						playInfo.set(rt.Data);

					} else {
						lyer.msg(rt.Msg);
						return false;
					}
				});
				}
				else{
					console.log("您必须从第一关开始玩");
				}
			}
			
			//想玩的层级大于可玩的层级
			if(PlayCollection > $scope.PlayCollection) {
				console.log("你没资格玩");
				return false;
			}
			////想玩的层级小雨等于可玩的层级
			else if(PlayCollection <= 1) {
				//第一个必玩的项目判断
				if($scope.PlayStage < PlayStage) {
					console.log("你还没前面一关");
					return false;
				} else if($scope.PlayStage > PlayStage) {
					console.log("你已经玩过这一关");
					return false;
				}
			}
			//点击的正好是当前关
			else if($scope.PlayCollection==PlayCollection&&$scope.PlayStage==PlayStage){
				
				return false;
			}

			console.log("你有资格玩");
			console.log(PlayCollection);
			console.log(PlayStage);
			//游戏进度查询api/yqsPlay/PlaySpeed/?uid=1&playid=1&playcollection=1&playstage=1
		    location.href="index.html#touzi"
			
			
		}

		//api/yqsPlay/PlaySpeed/?uid=1&playid=1&playcollection=1&playstage=1

	
	}])

	.controller('ziyouCtrl', ['$scope', '$rootScope', '$state', 'lyer', 'unlogin', function($scope, $rootScope, $state, lyer, unlogin) {
		// unlogin($scope);
		$rootScope.body_class = "ct_game_bg";
		$scope.footerShow = true;
		$scope.titleShow = true;
		$scope.$on('unlogin', unlogin);
		// 	if(angular.isObject(data.data) && data.data.Code == -2){
		// 		lyer.msg(data.data.Msg,function(){
		// 			$state.go('login');
		// 		})
		// 		return false;
		// 	}else if(angular.isObject(data.data) && (data.data.Code != -2 || data.data.Code !=0)){
		// 		lyer.msg(data.data.Msg);
		// 	}
		// })
	}])
	//投资
	.controller('touziCtrl', ['$scope', '$rootScope', 'API', 'userInfo','playInfo', '$state', 'lyer', 'unlogin',function($scope, $rootScope, API, userInfo, playInfo,$state, lyer, unlogin) {
		// unlogin($scope);
		$rootScope.body_class = "touzi_bg";
		$scope.footerShow = true;
		$scope.titleShow = true;
		$scope.warming=false;
		$scope.upload_PicUrl=false;
		$scope.cancel_btn=false;
		$scope.PlayStatus=0; //0 新方案     10 以匹配    50 以上传    70 后台确认   80  用户确认  100 已完成
		if(!$rootScope.isLogin) {
			location.href = "index.html#login";
			console.log($rootScope.isLogin);
			return false;
		} 
		if(!angular.isUndefined(userInfo.get())){
			console.log("方案存在");
			console.log(playInfo.get());
			$scope.playInfo=playInfo.get()[0];
			$scope.PlayStatus=$scope.playInfo.PlayStatus;
			if($scope.PlayStatus==0){
				
			}
			if($scope.PlayStatus=10){
				$scope.cancel_btn=true;
			}
			if($scope.PlayStatus=50){
				
			}
			if($scope.PlayStatus=70){
				
			}
			if($scope.PlayStatus=80){
				
			}
			if($scope.PlayStatus=100){
				
			}
			
			setInterval(function(){
				var now = new Date(); 
				var endDate = new Date($scope.playInfo.StartTime); 
				var leftTime=endDate.getTime()+1000*60*60*24-now.getTime(); 
				var leftsecond = parseInt(leftTime/1000); 
				//var day1=parseInt(leftsecond/(24*60*60*6)); 
				var day1=Math.floor(leftsecond/(60*60*24)); 
				var hour=Math.floor((leftsecond-day1*24*60*60)/3600); 
				var minute=Math.floor((leftsecond-day1*24*60*60-hour*3600)/60); 
				var second=Math.floor(leftsecond-day1*24*60*60-hour*3600-minute*60); 
				$scope.EndTime=hour+":"+minute+":"+second;
				$scope.$apply();
			},1000)
			
		}
	}])

	//个人中心
	.controller('userIndexCtrl', ['$scope', '$rootScope', '$state', 'API', 'lyer', '$cookieStore', function($scope, $rootScope, $state, API, lyer, $cookieStore) {

			// console.log($rootScope.isLogin);
			//判断是否登陆

			var params = {
					action: 1005,
					params: {}
				}
				//获取用户信息;
			API.ucInt(params)
				.success(function(rt) {
					if(rt.Code == 0) {
						$scope.data = rt.Data;
					}
				});

			$scope.logout = function() {
				$cookieStore.remove('userInfo');
				$rootScope.isLogin = false;
				$rootScope.token = '';
				$state.go('index');
			}
		}])
		//个人资料
	.controller('userDetailCtrl', ['$scope', '$rootScope', '$state', 'API', 'lyer', '$base64', 'userInfo', function($scope, $rootScope, $state, API, lyer, $base64, userInfo) {
			// console.log($base64);

			var params = {
				action: 1005,
				params: {}
			}
			API.ucInt(params)
				.success(function(rt) {
					if(rt.Code == 0) {
						$scope.data = rt.Data
						$scope.data.id = userInfo.get().UserId;
						// console.log($scope.data);
					}
				});
		}])

	//修改手机号码
	.controller('editPhoneCtrl', ['$scope', function($scope) {

	}])

	.controller('otherCtrl', ['$scope', '$stateParams', function($scope, $stateParams) {
		$scope.userid = $stateParams.userid;
		if(angular.isUndefined($scope.userid)) {
			$state.go('index');
			return false;
		}
		// console.log()
	}])

})(window, angular);