angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $location, $ionicNavBarDelegate, Authenticate, Plan) {
	Authenticate.confirmLoggedIn();

	$scope.plan = {};
	
	$scope.createPlan =  function (form) {
	
		$scope.submitted = true;
		var user_id =  window.localStorage['currentUser'];

		
		Plan.createNew({
			p_date: 		$scope.plan.date,
			f_time: 	$scope.plan.ftime,
			t_time: 		$scope.plan.ttime,
			user_id: 		user_id,
			summary: 	$scope.plan.summary,
			description:  		$scope.plan.description
		})
		.then(function(data) {
			console.log('New Plan Creation = OK');
			$location.path('/tab/chats');
		}) 
		.catch( function(err) {     
			console.log('New Plan Creation = NOK : ' + JSON.stringify(err));

        //    $scope.error.message = err.data.userMessage ? err.data.userMessage : err.data.message;
           // Network.processErrors(err, true);
        });
	

	};

	$scope.cancelNew = function () {

		$ionicNavBarDelegate.back();
	};


})

.controller('LoginCtrl', function($rootScope, $scope, $location, $ionicModal,$ionicNavBarDelegate, Authenticate,UserHistory) {

	$scope.user = {};
	$scope.error = {};
	$rootScope.hideBackButton = false;
	//$ionicSideMenuDelegate.canDragContent(false);

	$scope.user.email = "";
	$scope.user.password = "";

	$ionicNavBarDelegate.showBar(false);
	
	$scope.login =  function (form) {
	
		$scope.submitted = true;

		console.log(JSON.stringify($scope.user));

		
		Authenticate.login({
			email: $scope.user.email,
			password: $scope.user.password
		})
		.then(function(data) {
			console.log('Login = OK');
 			console.log(JSON.stringify(data));
			$rootScope.currentuser = data;
			UserHistory.login(data._id);
			//NotificationClient.register();
			console.log(data._id);
			$location.path('/tab/chats');
		}) 
		.catch( function(err) {
            
           // $scope.error.message = err.data.message;
   //         Network.processErrors(err, true);
            console.log('Login = NOK : ' +JSON.stringify(err));
	    console.log($scope.error.message);
        });

	};

	$scope.registerNewUser = function () {
		$location.path('/registration');
	};
})

.controller('RegistrationCtrl', function($rootScope, $scope, $location, $ionicModal, Authenticate, $ionicNavBarDelegate, $ionicSlideBoxDelegate, $ionicSideMenuDelegate, UserHistory, Users) {

	$scope.user = {};
	$scope.error = {};
	$rootScope.hideBackButton = false;
	$ionicNavBarDelegate.showBar(false);
	
	$scope.signUp =  function (form) {
	
		$scope.submitted = true;

		
		Users.createNew({
			name: 		$scope.user.name,
			phone: 	$scope.user.phone,
			email: 		$scope.user.email,
			password: 	$scope.user.password,
			address:  		$scope.user.address,
			city:  		$scope.user.city,
			country:  		$scope.user.country
		})
		.then(function(data) {
			console.log('New User Creation = OK');

			UserHistory.login(data._id);
			//NotificationClient.register();
			//$scope.modal4.show();
			//$ionicSlideBoxDelegate.next();
			$location.path('/tab/chats');
		}) 
		.catch( function(err) {     
			console.log('New User Creation = NOK : ' + JSON.stringify(err));

            $scope.error.message = err.data.userMessage ? err.data.userMessage : err.data.message;
           // Network.processErrors(err, true);
            
        });
	

	};
})

.controller('EditAccountCtrl', function($scope, $rootScope, apiUrls, Authenticate, $ionicNavBarDelegate, Users, $cordovaToast) {
	Authenticate.confirmLoggedIn();
	$ionicNavBarDelegate.showBar(false);
		$scope.user = $rootScope.currentuser;

	$rootScope.hideBackButton = false;

	$scope.cancelEdit = function () {

		$ionicNavBarDelegate.back();
	}


	$scope.saveProfile = function () {
	          var userid = window.localStorage['currentUser'];
		  console.log(JSON.stringify($scope.user));
		updateUser();

		function updateUser() {

			Users.update_me({
				name: 	$scope.user.name,
				phone:  		$scope.user.phone,
				address: 	$scope.user.address,
				city:  		$scope.user.city,
				country: 	$scope.user.country
			},userid)
			.then(function(data) {
				console.log('User Update = OK');
				$ionicNavBarDelegate.back();
			}) 
			.catch( function(err) {     
				console.log('User Update = NOK : ' +err);

	            $scope.error.message = err.data.userMessage ? err.data.userMessage : err.data.message;
	            //Network.processErrors(err, true);
	            $ionicNavBarDelegate.back();
	        });

		}
	}
})


.controller('ChatsCtrl', function($scope, Chats,Authenticate, Plan) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
	$scope.chats = [];
	Authenticate.confirmLoggedIn();
  	$scope.sdate = new Date();
	document.getElementById('datetimepicker').valueAsDate = new Date();

	$scope.prevDay = function() {
		var date1 = document.getElementById('datetimepicker').valueAsDate;
		date1 = date1 - 86400;
		document.getElementById('datetimepicker').valueAsDate = date1;		
	};

	$scope.nextDay = function() {
		var date1 = document.getElementById('datetimepicker').valueAsDate;
		date1 = date1 + 86400;
		document.getElementById('datetimepicker').valueAsDate = date1;		
	};

	//$scope.userid = 
		var userid = window.localStorage['currentUser'];
		var ndate = $scope.sdate;
		var year = ndate.getFullYear();
		var month = ndate.getMonth();
		var day = ndate.getDate();

		Plan.getPlan(userid)
		.then(function(data){
			console.log('In the func');
			console.log(JSON.stringify(data.data));
			data.data.forEach(function(plan, idx){
					var pdate = new Date(plan.p_date);
						if((pdate.getDate() == day) && (pdate.getMonth() == month) && (pdate.getFullYear() == year))
						{
							  $scope.chats.push(plan);
						}
					});
			//$scope.chats = data.data;		
			console.log(JSON.stringify($scope.chats));
		})
		.catch(function(err){
			console.log(err);
		});

	$scope.getPlan = function(){
		$scope.chats = [];
			console.log('Outside the func');
		var userid = window.localStorage['currentUser'];
		var ndate = $scope.sdate;
		var year = ndate.getFullYear();
		var month = ndate.getMonth();
		var day = ndate.getDate();
		
		Plan.getPlan(userid)
		.then(function(data){
			console.log('In the func');
			console.log(JSON.stringify(data.data));
			data.data.forEach(function(plan, idx){
					var pdate = new Date(plan.p_date);
					
						console.log(pdate + ' ' + plan.p_date);
						if((pdate.getDate() == day) && (pdate.getMonth() == month) && (pdate.getFullYear() == year))
						{
							  $scope.chats.push(plan);
						}
					});
			//$scope.chats = data.data;		
			console.log(JSON.stringify($scope.chats));
		})
		.catch(function(err){
			console.log(err);
		});
	};


//Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats, Authenticate) {
Authenticate.confirmLoggedIn();
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($rootScope, $scope, $location, Authenticate, Users, UserHistory) {
  Authenticate.confirmLoggedIn();
  $scope.user = $rootScope.currentuser;
  $rootScope.hideBackButton = false;
  
  var userid = window.localStorage['currentUser'];
		// TODO: Use Service for this
  Users.getUser(userid)
  .then(function (data) {
     $rootScope.currentuser = data.data;
     $scope.user = data.data;
  })
  .catch (function (err) {
     	//Network.processErrors(err, false);
	console.log(err);
   });

   $scope.editProfile = function () {
	$location.path('/edit-account');
   }

   $scope.logout = function() {
	Authenticate.logout()
        .then(function () {
              	UserHistory.logout($rootScope.currentuser._id);
               	//NotificationClient.unregister();
               	$rootScope.currentuser = null;
              	
               	console.log('LOGOUT = OK');
                    $location.path('/login');
                })
                .catch( function (err) {
                	console.log('LOGOUT = NOK');
                });
    }
});
