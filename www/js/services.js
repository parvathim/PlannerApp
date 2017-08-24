angular.module('starter.services', [])

.factory('Session', function ($resource, apiUrls) {
	/*var base = window.localStorage.getItem("cbUrl");

  var ch = base.charAt(base.length-1);



  if(ch == '/')
  {
	base = base.substring(0,base.length-1);
  }	*/

        return $resource(apiUrls.sessionLogin);
})


.factory('Authenticate', function($rootScope, Session, $location) {
  
  return {
    login: function(user) {
      return Session.save({
        email: user.email,
        password: user.password
      }).$promise;
    },

    logout: function () {
                return Session.delete().$promise;
            },

    confirmLoggedIn: function () {
              if ($rootScope.loggedIn == false) {
                 $location.path('/login');
              }
	      else
	      {
	      	console.log("Coming here " + $rootScope.loggedIn);
	      }
            }

    }

})

.factory('UserHistory', function($rootScope, $ionicLoading) { 

  var userHistory = {};

  return {
    login: function(userId) {
        window.localStorage['currentUser'] = userId;
        userHistory = {'viewTimeStamp': {'allFeeds': 1000},'loginStatus': true};
        if(window.localStorage[userId]) {
            userHistory = JSON.parse(window.localStorage[userId]);
            userHistory['loginStatus'] = true;
        }
        window.localStorage[userId] = JSON.stringify(userHistory);
        $rootScope.loggedIn = true;  
    },
    logout: function (userId) {
          userHistory = JSON.parse(window.localStorage[userId]);
          userHistory['loginStatus'] = false;
          window.localStorage[userId] = JSON.stringify(userHistory);
          window.localStorage.removeItem('currentUser');

          $rootScope.loggedIn = false;
    },
    get: function (id) {
        return JSON.parse(window.localStorage[id]);
    },
    getLastViewTime: function(id, key) {
        var lastViewTime; 

        userHistory = JSON.parse(window.localStorage[id]);
        if (key == 'allFeeds')
            lastViewTime =  new Date(userHistory.viewTimeStamp.allFeeds);
        else 
            lastViewTime =  new Date(userHistory.viewTimeStamp[key] ? userHistory.viewTimeStamp[key] : 1000);

        return lastViewTime;
    },
    updateViewTimeStamp: function(id, key) {
        userHistory = JSON.parse(window.localStorage[id]);
        if (key == 'allFeeds')
            userHistory.viewTimeStamp.allFeeds = new Date();
        else 
            userHistory.viewTimeStamp[key] = new Date();
        window.localStorage[id] = JSON.stringify(userHistory);
    },
    retrieveLogin: function () {
        $rootScope.loggedIn = false;
        if (window.localStorage['currentUser']) {
            if (window.localStorage[window.localStorage['currentUser']]) {
                userHistory = JSON.parse(window.localStorage[window.localStorage['currentUser']]);
                $rootScope.loggedIn = userHistory['loginStatus'];
            } else {
                $rootScope.loggedIn = false;
            }
        } else {
            $rootScope.loggedIn = false;
        }
    },
    setLoginStatus: function (id, status) {
        userHistory = JSON.parse(window.localStorage[id]);
        userHistory['loginStatus'] = status;
        window.localStorage[id] = JSON.stringify(userHistory);
    }
  }
})

.factory('Users', function($rootScope, $http, $resource, apiUrls) {
  return {
    createNew: function(user) {
      return $resource(apiUrls.users).save(user).$promise;
    },
    update_me: function(me,userid) {
      return $resource(apiUrls.users+userid).save(me).$promise;
    },
    getUser: function(userId) {
      return $resource(apiUrls.users+userId).get().$promise;
    }
  }
})

.factory('Plan', function($rootScope, $http, $resource, apiUrls) {
  return {
    createNew: function(plan) {
      return $resource(apiUrls.plan).save(plan).$promise;
    },
    getPlan: function(userId) {
      return $resource(apiUrls.plan + userId).get().$promise;
    }
  }
})



.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
