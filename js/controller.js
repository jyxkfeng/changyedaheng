(function(window,angular){
	angular.module('app')
		//首页
		.controller('indexCtrl', ['$scope','API','lyer','countDown', function($scope,API,lyer,countDown){

			// console.log(API);
			var bannerParams = {
				action:2005,
				params:angular.toJson({
					btype:0
				})
			}
			//首页轮播图
			API.ucInt(bannerParams)
				.success(function(rt){
					// console.log(rt);
					if(rt.Code == 0){
						$scope.banner = rt.Data.list;

						setTimeout(function(){
							var mySwiper = new Swiper('.swiper-container', {
								autoplay: 3000,//可选选项，自动滑动
								pagination : '.swiper-pagination',
							})
						},50);
					}
				});

			//最新揭晓
			var newAnnParams = {
				action:2007,
				params:angular.toJson({
					pageindex:1,
					pagesize:3
				})
			}
			API.ucInt(newAnnParams)
				.success(function(rt){
					if(rt.Code ==0){
						$scope.newAnn = rt.Data.item;

						//262918
						$scope.newAnn.forEach(function(item){
							if(item.status == 2){
								countDown(item.stamp,new Date(),item,function(){
									item.status =4;
									var params = {
										action:3001,
										params:angular.toJson({
											issueid:item.issueid,
											pid:item.productid
										})
									}

									API.ucInt(params)
										.success(function(rt){
											if(rt.Code == 0){
												if(rt.Data && rt.Data.ProductIssueInfo){
													item.status = rt.Data.ProductIssueInfo.Status;
													item.username = rt.Data.ProductIssueInfo.UserName;
													item.winNumber = rt.Data.ProductIssueInfo.WinNumber;												}
												// item.status =
											}
										})
								
								});
							}
						})
					}
				});


			//上架新品
			var newProductParams = {
				action:2006,
				params:angular.toJson({
					ptypeid:0,
					ordertype:"3",
					pageindex:1,
					pagesize:3
				})
			}
			API.ucInt(newProductParams)
				.success(function(rt){
					// console.log(rt);
					if(rt.Code == 0){
						$scope.newProduct = rt.Data.item;
						// console.log($scope.newProduct);
					}
				});


			//热门商品
			var hotParams = {
				action:2008,
				params:{}
			}
			API.ucInt(hotParams)
				.success(function(rt){
					if(rt.Code == 0){
						$scope.hot = rt.Data;
						$scope.hot.forEach(function(item){
							item.width = Math.ceil(item.buyshare / item.share *100);
						});
					}else{
						lyer.msg(rt.Msg);
					}
				})

			
			
		}])
		//注册
		.controller('registerCtrl', ['$scope','API','lyer','md5',function($scope,API,lyer,md5){
			
			$scope.params={name:'',pwd:'',repwd:'',tel:'',email:'',reference:'',referencetel:''};
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
				API.qtInt('http://10.33.96.130:9001/api/yqsuser/Register/',params)
					.success(function(rt){
						rt=angular.fromJson(rt)
						if(rt.Code ==0){
							
							$scope.data = rt.Data;
							lyer.msg('注册成功');
						}
						else{
								lyer.msg('请输入正确的手机号码');
								return false;
						}
					});
				
				
			}
			
			
		}])
		//登陆
		.controller('loginCtrl', ['$scope','API','lyer','userInfo','md5',function($scope,API,lyer,userInfo,md5){
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
				API.qtInt('http://10.33.96.130:9001/api/yqsuser/Login/',params)
					.success(function(rt){
						rt=angular.fromJson(rt)
						
						if(rt.Code == 0){
							
							$scope.data = rt.Data;
							userInfo.set(rt.Data);
						}
						else{
								lyer.msg(rt.Msg);
							}
					});
					
			}

			

		}])

		.controller('userCtrl', ['$scope','$state','lyer','unlogin', function($scope,$state,lyer,unlogin){
			// unlogin($scope);
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











