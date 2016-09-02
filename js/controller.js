(function(window, angular) {
	angular.module('app')
		//首页
		.controller('indexCtrl', ['$scope','$state','$rootScope', 'API', 'lyer', 'userInfo', 'countDown', 'isBindCard', function($scope,$state, $rootScope, API, lyer, userInfo, countDown, isBindCard) {
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
				$state.go('login');
				console.log($rootScope.isLogin);
				return false;
			}
			//判断用户是否绑定
			isBindCard();
			if(!$rootScope.IsBindBank) {
				console.log("去绑定银行卡");
				$state.go('bankcard');
			
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
		.controller('registerCtrl', ['$scope','$state', '$rootScope', 'API', 'lyer', 'md5', function($scope,$state, $rootScope, API, lyer, md5) {
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
								$state.go('login');
								
							});

						} else {
							lyer.msg('注册格式有误，请先检查');
							return false;
						}
					});

			}

		}])
		//登陆
		.controller('loginCtrl', ['$scope','$state','$rootScope', 'API', 'lyer', 'userInfo', 'md5', function($scope,$state, $rootScope, API, lyer, userInfo, md5) {
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
							$state.go('index');
						} else {
							lyer.msg(rt.Msg);
						}
					});

			}

		}])
		//绑定银行卡
		.controller('bankcardCtrl', ['$scope','$state', '$rootScope', 'API', 'lyer', 'userInfo', 'md5', function($scope, $state,$rootScope, API, lyer, userInfo, md5) {
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
								$state.go('index');
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
			$state.go('login');
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

	.controller('kfCtrl', ['$scope', '$rootScope','userInfo', 'API','$state', 'lyer', 'unlogin', function($scope, $rootScope,userInfo,API, $state, lyer, unlogin) {
		// unlogin($scope);
		$rootScope.body_class = "kf_bg";
		$scope.footerShow = true;
		$scope.titleShow = true;
		$scope.type=1;
		$scope.MyQuestion;
		$scope.username="";
		$scope.tel="";
		
		if(!$rootScope.isLogin) {
			$state.go('login');
			console.log($rootScope.isLogin);
			return false;
		} 
		$scope.typeSelect=function(type){
			$scope.type=type;	
		}
		$scope.sbQuestion=function(){
			var params={
				uid:userInfo.get().UId,
				tel:$scope.tel,
				name:$scope.username,
				type:$scope.type,
				question:$scope.MyQuestion
			}
			//api/yqsAssistant/NewQuestion/?uid=1&tel=18112617821&name=test1&type=1&question=怎么注册？
			API.qtInt('/api/yqsAssistant/NewQuestion/', params)
					.success(function(rt) {
						rt = angular.fromJson(rt)
						if(rt.Code == 0) {
							lyer.msg(rt.Msg);
						} else {
							lyer.msg(rt.Msg);
							return false;
							
						}
					});
			
			
		}
		
	}])

	.controller('chuantongCtrl', ['$scope', '$rootScope', 'API', 'userInfo','playInfo', '$state', 'lyer', 'unlogin', 'RefreshUserInfo',function($scope, $rootScope, API,userInfo,playInfo, $state, lyer, unlogin,RefreshUserInfo) {
		$rootScope.body_class = "ct_game_bg";
		$scope.footerShow = true;
		$scope.titleShow = true;
		$scope.gzdialog = false;
		var params;
		if(!$rootScope.isLogin) {
			$state.go('login');
			console.log($rootScope.isLogin);
			return false;
		} else {
			   //刷新用户信息
				userid={'uid':userInfo.get().UId}
				API.qtInt('/api/yqsuser/Refresh/', userid)
					.success(function(rt) {
						rt = angular.fromJson(rt)
						if(rt.Code == 0) {
							userInfo.set(rt.Data);
							console.log(userInfo.get());	
						} else {
							return false;
						}
					});
//			function PlaySpeed(params){
//				API.qtInt('/api/yqsPlay/PlaySpeed/', params)
//				.success(function(rt) {
//					rt = angular.fromJson(rt)
//					if(rt.Code == 0) {
//						
//						playInfo.set(rt.Data);
//						console.log(playInfo.get()[0]);
//					} else {
//						return false;
//					}
//				});
//			}
			
					
				
	
		}
		$scope.playGame = function(PlayCollection, PlayStage) {
			
			$scope.PlayCollection=userInfo.get().PlayCollection;
			$scope.PlayStage=userInfo.get().PlayStage;
			//当前没有玩游戏
			if($scope.PlayCollection==0&&$scope.PlayStage==0){
				if(PlayCollection==1&&PlayStage==1){
					console.log("新建游戏");
					$state.go('touzi',{
						Playid:1,
						PlayCollection:1,
						PlayStage:1
					})
					return false;
			// api/yqsPlay/Play/?uid=1&playid=1&playcollection=1&playstage=1
//			var params = {
//				'uid': userInfo.get().UId,
//				'playid': 1,
//				'playcollection': PlayCollection,
//				'playstage': PlayStage
//			};
//
//			API.qtInt('/api/yqsPlay/Play/', params)
//				.success(function(rt) {
//					rt = angular.fromJson(rt)
//					if(rt.Code == 0) {
//						console.log(rt);
//						playInfo.set(rt.Data);
//
//					} else {
//						lyer.msg(rt.Msg);
//						return false;
//					}
//				});
				}
				else{
					lyer.msg('您必须从第一关开始玩');
				}
			}
			
			//想玩的层级大于可玩的层级
			if(PlayCollection > $scope.PlayCollection) {
				console.log("你没资格玩");
				lyer.msg('你还未获取此关游戏的资格.请努力!');
				return false;
			}
			////想玩的层级在第一层级
			if(PlayCollection <= 1) {
				//第一个必玩的项目判断
				if($scope.PlayStage < PlayStage) {
					lyer.msg('你还没通过前面一关');
					return false;
				} else if($scope.PlayStage > PlayStage) {
					lyer.msg('你已经玩过这一关');
					return false;
				}
				else if($scope.PlayStage== PlayStage){
					$state.go('touzi',{
						Playid:1,
						PlayCollection:1,
						PlayStage:PlayStage
					})
				return false;
				}
			}
			//点击的正好是当前层级
			if($scope.PlayCollection==PlayCollection&&$scope.PlayStage==PlayStage){
				//打开当前关
				console.log("打开当前关");
				$state.go('touzi',{
						Playid:1,
						PlayCollection:PlayCollection,
						PlayStage:PlayStage
					})
				return false;
			}
			

//			console.log("你有资格玩");
//			console.log(PlayCollection);
//			console.log(PlayStage);
//			//游戏进度查询api/yqsPlay/PlaySpeed/?uid=1&playid=1&playcollection=1&playstage=1
//		    location.href="index.html#touzi"
			
			
		}

		//api/yqsPlay/PlaySpeed/?uid=1&playid=1&playcollection=1&playstage=1

	
	}])

	.controller('ziyouCtrl', ['$scope', '$rootScope', '$state', 'lyer', function($scope, $rootScope, $state, lyer) {
		// unlogin($scope);
		$rootScope.body_class = "ct_game_bg";
		$scope.footerShow = true;
		$scope.titleShow = true;
		$scope.playGame = function(PlayCollection, PlayStage) {
			$state.go('touzi',{
						Playid:2,
						PlayCollection:PlayCollection,
						PlayStage:PlayStage
					})
		}


	}])
	//投资
	.controller('touziCtrl', ['$scope', '$rootScope', 'API', 'userInfo','playInfo', '$state', 'lyer', '$stateParams',function($scope, $rootScope, API, userInfo, playInfo,$state, lyer, $stateParams) {
		// unlogin($scope);
		
		if(!$rootScope.isLogin) {
			$state.go('login');
			console.log($rootScope.isLogin);
			return false;
		} 
		
		$rootScope.body_class = "touzi_bg";
		$scope.footerShow = true;
		$scope.titleShow = true;
		$scope.warming=false;
		$scope.upload_PicUrl=false;
		$scope.cancel_btn=false;
		
		
		$scope.PlayCollection = $stateParams.PlayCollection;
		$scope.PlayStage = $stateParams.PlayStage;
		$scope.Playid=$stateParams.Playid;
		console.log('$scope.PlayCollection'+$scope.PlayCollection);
		console.log('$scope.PlayStage'+$scope.PlayStage);
		
		//进入游戏查询游戏进度
			var params = {
				'uid': userInfo.get().UId,
				'playid':$scope.Playid,
				'playcollection': $scope.PlayCollection,
				'playstage': $scope.PlayStage
			};
		API.qtInt('/api/yqsPlay/PlaySpeed/', params)
			.success(function(rt) {
				rt = angular.fromJson(rt)
				if(rt.Code == 0&&rt.Data.Data.length>0) {
					//查询得到游戏进度
					playInfo.set(rt.Data.Data);
					$scope.playInfo=playInfo.get()[0];
					console.log($scope.playInfo);
					$scope.status=$scope.playInfo.PlayStatus;
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
					
					
				} else {
					//未查询到游戏进度,新建游戏
					$scope.status=-1;
					playInfo.set(rt.Data);
					$scope.playInfo=playInfo.get()
					console.log($scope.playInfo);
					
					
					
//					API.qtInt('/api/yqsPlay/Play/', params)
//									.success(function(rt) {
//										rt = angular.fromJson(rt)
//										if(rt.Code == 0) {
//											console.log(rt);
//											$state.reload()
//					
//										} else {
//											lyer.msg(rt.Msg);
//											return false;
//										}
//									});
					
					return false;
				}
				
				
				
				
				
				
				
				
				
				
			});
			
		  $scope.buildNewGame=function(){
		  	$scope.warming=true;
		  	
		  }
		  $scope.buildOrder=function(){
		  	var params = {
				'uid': userInfo.get().UId,
				'playid':$scope.Playid,
				'playcollection': $scope.PlayCollection,
				'playstage': $scope.PlayStage
			};
			//确认无误,创建订单
			API.qtInt('/api/yqsPlay/Play/', params)
				.success(function(rt) {
					rt = angular.fromJson(rt)
					if(rt.Code == 0) {
						console.log(rt);
						$state.reload()

					} else {
						lyer.msg(rt.Msg);
						return false;
					}
				});
			
			$scope.warming=false;
		  }
		  $scope.cacel_build=function(){
		  	//反悔,取消创建订单
		  	$scope.warming=false;
		  }
		
		 //0 新方案     50 以匹配    70 付款上传成功     100 已完成
		
		
						
		
			

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