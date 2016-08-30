(function(window,angular){
	angular.module('app')
		//首页
		.controller('indexCtrl', ['$scope','$rootScope','API','lyer','userInfo','countDown','isBindCard', function($scope,$rootScope,API,lyer,userInfo,countDown,isBindCard){
			$rootScope.body_class="index_bg";
			console.log($rootScope.isLogin);
			$scope.footerShow=true;
			$rootScope.IsBindBank=false; 
			$scope.titleShow=true;
			$scope.tipShow=false;
			
			$scope.swiper=function(){
				var mySwiper = new Swiper('.swiper-container', {
								autoplay: 3000,//可选选项，自动滑动
								pagination : '.swiper-pagination',
							})
			}
			$scope.swiper();
			

			
			
			
			setInterval(function(){
						
					//	api/yqsAssistant/Assistant/?id=1
						var params ={'id':userInfo.get().UId};
						//秘书提醒功能
					API.qtInt('/api/yqsAssistant/Assistant/',params)
					.success(function(rt){
						rt=angular.fromJson(rt)
						if(rt.Code == 0){
							$scope.tipShow=true;
							console.log('$scope.tipShow='+$scope.tipShow);
							$scope.$apply();//重置
							$scope.data = rt.Data;
							
							
						}
						else{
								
								return false;
						}
					});
						
						
						
						
					},3000)
			
			//未登录 跳转到 登陆页
			
			if(!$rootScope.isLogin){
				location.href="index.html#login";
				console.log($rootScope.isLogin);
				return false;
			}
			//判断用户是否绑定
			isBindCard();
			if(!$rootScope.IsBindBank){
				console.log("去绑定银行卡");
				location.href="index.html#bankcard";
				return false;
			}
			// console.log(API);
			var bannerParams = {
				action:2005,
				params:angular.toJson({
					btype:0
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
		.controller('registerCtrl', ['$scope','$rootScope','API','lyer','md5',function($scope,$rootScope,API,lyer,md5){
			$rootScope.body_class="login_bg";
			$scope.titleShow=true;
			$scope.params={};
			$scope.isRegister=false;
			$scope.zhuce=function(){
				
				console.log('register');
				console.log($scope.params)
				if($scope.registerForm.name.$error.required||$scope.registerForm.pwd.$error.required||$scope.registerForm.tel.$error.required||$scope.registerForm.reference.$error.required||$scope.registerForm.referencetel.$error.required){
					lyer.msg('不能为空');
					return false;
				}
				if($scope.params.pwd!=$scope.params.repwd){
					lyer.msg('两次密码不一致');
					return false;
				}
				else if($scope.registerForm.name.$error.pattern||$scope.registerForm.pwd.$error.pattern||$scope.registerForm.tel.$error.pattern||$scope.registerForm.reference.$error.pattern||$scope.registerForm.referencetel.$error.pattern){
					lyer.msg('请正确输入');
					return false;
				}
				
				$scope.isRegister=true;
				
				$scope.params.pwd=md5.createHash($scope.params.pwd+'Q56GtyNkop97H334TtyturfgErvvv98r' || '');
				$scope.params.repwd=md5.createHash($scope.params.repwd+'Q56GtyNkop97H334TtyturfgErvvv98r' || '');
				
				var params =angular.extend({},$scope.params);
				
				//提交表单注册 ;
				API.qtInt('/api/yqsuser/Register/',params)
					.success(function(rt){
						rt=angular.fromJson(rt)
						if(rt.Code ==0){
							
							$scope.data = rt.Data;
							lyer.msg('注册成功',function(){
								location.href="index.html#login";
							});
							
						}
						else{
								lyer.msg('注册格式有误，请先检查');
								return false;
						}
					});
				
				
			}
			
			
		}])
		//登陆
		.controller('loginCtrl', ['$scope','$rootScope','API','lyer','userInfo','md5',function($scope,$rootScope,API,lyer,userInfo,md5){
			$rootScope.body_class="login_bg";
			$scope.titleShow=true;
			console.log('login');
			$scope.params={};
			$scope.login=function(){
				
				if($scope.loginForm.name.$error.required){
					lyer.msg('请输入手机号码');
					return false;
				}else if($scope.loginForm.name.$error.pattern){
					lyer.msg('请输入正确的手机号码');
					return false;
				}
				
				
				$scope.params.pwd=md5.createHash($scope.params.pwd+'Q56GtyNkop97H334TtyturfgErvvv98r' || '');
				var params =angular.extend({},$scope.params);
				//提交表单登陆 ;
				API.qtInt('/api/yqsuser/Login/',params)
					.success(function(rt){
						rt=angular.fromJson(rt)
						
						if(rt.Code == 0){
							
							$scope.data = rt.Data;
							userInfo.set(rt.Data);
							location.href="index.html#index";
						}
						else{
								lyer.msg(rt.Msg);
							}
					});
					
			}

			

		}])
		//绑定银行卡
		.controller('bankcardCtrl', ['$scope','$rootScope','API','lyer','userInfo','md5',function($scope,$rootScope,API,lyer,userInfo,md5){
			$rootScope.body_class="login_bg";
			$scope.titleShow=true;
			$scope.params={};
			$scope.isbindcard=false;
			$scope.bindCard=function(){
				
				console.log('bindCard');
				console.log(userInfo.get().UId);
				if($scope.registerForm.realname.$error.required||$scope.registerForm.cardid.$error.required||$scope.registerForm.cardtype.$error.required||$scope.registerForm.cardaddress.$error.required||$scope.registerForm.alipayid.$error.required){
					lyer.msg('不能为空');
					return false;
				}
				else if($scope.registerForm.realname.$error.pattern||$scope.registerForm.cardid.$error.pattern||$scope.registerForm.cardtype.$error.pattern||$scope.registerForm.cardaddress.$error.pattern||$scope.registerForm.alipayid.$error.pattern){
					lyer.msg('请正确输入');
					return false;
				}
				
				 	//$scope.isbindcard=false;
				 	var params =angular.extend({'uid':userInfo.get().UId},$scope.params);
				 	console.log(params);
				 	//提交银行卡绑定 ;
				API.qtInt('/api/yqsuser/BandCard/',params)
					.success(function(rt){
						rt=angular.fromJson(rt)
						if(rt.Code == 0){
							
							$scope.data = rt.Data;
							lyer.msg('绑定成功');
						}
						else{
								lyer.msg(rt.Msg);
								return false;
						}
					});
				
				 	
				
				
			}

			

		}])
		
		
		//游戏选择
		.controller('gamelistCtrl', ['$scope','$rootScope','$state','lyer','unlogin', function($scope,$rootScope,$state,lyer,unlogin){
			// unlogin($scope);
			$rootScope.body_class="gamelist_bg";
			console.log($rootScope.isLogin);
			$scope.footerShow=true;
			$scope.titleShow=true;
			$scope.tipShow=false;
			
			$scope.$on('unlogin',unlogin);
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
		
		
		
		.controller('myhomeCtrl', ['$scope','$rootScope','$state','lyer','unlogin', function($scope,$rootScope,$state,lyer,unlogin){
			// unlogin($scope);
			$rootScope.body_class="myhone_bg";
			$scope.footerShow=true;
			$scope.titleShow=true;
			$scope.$on('unlogin',unlogin);
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
		
		.controller('kfCtrl', ['$scope','$rootScope','$state','lyer','unlogin', function($scope,$rootScope,$state,lyer,unlogin){
			// unlogin($scope);
			$rootScope.body_class="kf_bg";
			$scope.footerShow=true;
			$scope.titleShow=true;
			$scope.$on('unlogin',unlogin);
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
		
		.controller('chuantongCtrl', ['$scope','$rootScope','$state','lyer','unlogin', function($scope,$rootScope,$state,lyer,unlogin){
			// unlogin($scope);
			$rootScope.body_class="ct_game_bg";
			$scope.footerShow=true;
			$scope.titleShow=true;
			$scope.$on('unlogin',unlogin);
			$scope.gzdialog=false;
			
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
		
		.controller('ziyouCtrl', ['$scope','$rootScope','$state','lyer','unlogin', function($scope,$rootScope,$state,lyer,unlogin){
			// unlogin($scope);
			$rootScope.body_class="ct_game_bg";
			$scope.footerShow=true;
			$scope.titleShow=true;
			$scope.$on('unlogin',unlogin);
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
		
		//个人中心
		.controller('userIndexCtrl', ['$scope','$rootScope','$state','API','lyer','$cookieStore', function($scope,$rootScope,$state,API,lyer,$cookieStore){

			// console.log($rootScope.isLogin);
			//判断是否登陆
			
			var params = {
				action:1005,
				params:{}
			}
			//获取用户信息;
			API.ucInt(params)
				.success(function(rt){
					if(rt.Code == 0){
						$scope.data = rt.Data;
					}
				});

			$scope.logout = function(){
				$cookieStore.remove('userInfo');
				$rootScope.isLogin = false;
				$rootScope.token = '';
				$state.go('index');
			}
		}])
		//个人资料
		.controller('userDetailCtrl', ['$scope','$rootScope','$state','API','lyer','$base64','userInfo', function($scope,$rootScope,$state,API,lyer,$base64,userInfo){
			// console.log($base64);
		
			var params = {
				action:1005,
				params:{}
			}
			API.ucInt(params)
				.success(function(rt){
					if(rt.Code == 0){
						$scope.data = rt.Data
						$scope.data.id = userInfo.get().UserId; 
						// console.log($scope.data);
					}
				});
		}])

		//修改手机号码
		.controller('editPhoneCtrl', ['$scope', function($scope){
			
		}])


	
	

	
		.controller('otherCtrl', ['$scope','$stateParams', function($scope,$stateParams){
			$scope.userid = $stateParams.userid;
			if(angular.isUndefined($scope.userid)){
				$state.go('index');
				return false;
			}
			// console.log()
		}])

})(window,angular);











