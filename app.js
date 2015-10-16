var app = angular.module('angularSmall', ['ui.router', 'ngResource']);


app.config(function ($stateProvider, $urlRouterProvider) {
  
  $stateProvider
    .state('user-index', {
      url: "/",
      templateUrl: "templates/user-index.html",
      controller: 'UserIndexCtrl'
    })
    .state('user-show', {
    	url: "/users/:user_id",
    	templateUrl: "templates/user-show.html",
    	controller: 'UserShowCtrl'
    });

  // For any unmatched url, redirect to /
  $urlRouterProvider.otherwise("/");

});

 
app.controller('MainCtrl', function ($scope) {
	$scope.message = "World!"
});


app.controller('UserIndexCtrl', function ($scope, User) {	
	$scope.users = User.query();

	$scope.addUser = function() {
		User.save($scope.newUser, function (data) {
			$scope.users.push(data);
			$scope.newUser = {};		
		})
	};

	$scope.removeUser = function(user) {
		User.remove(user, function (data) {
			var index = $scope.users.indexOf(user);
			$scope.users.splice(index, 1);
		});
	}
});

app.controller('UserShowCtrl', function ($stateParams, $scope, User, $http) {
	User.get({ id: $stateParams.user_id }, function (data) {
		$scope.user = data;
		getGifs(data.firstname)
	});

	function getGifs(firstName) {
		var query = 'http://api.giphy.com/v1/gifs/search?q=' + firstName + '&api_key=dc6zaTOxFJmzC';

		$http.get(query).then(
			function (data) {
				$scope.gifs = data.data.data
			},
			function (error) {
				console.log(error);
			}
		);
	}
});

app.factory('User', function ($resource) {
	var HOST = 'http://daretodiscover.herokuapp.com'
	return $resource(HOST + '/users/:id', { id: '@id' })

	// var users = [
	// 	{ id: 1, name: 'Betsy', age: 73 },
	// 	{ id: 2, name: 'Norman', age: 40 },
	// 	{ id: 3, name: 'Sonja', age: 6 }
	// ];

	// return {
	//   all: function() {
	//     return users;
	//   },
	//   remove: function(user) {
	//     users.splice(users.indexOf(user), 1);
	//   },
	//   get: function(userId) {
	//     for (var i = 0; i < users.length; i++) {
	//       if (users[i].id === parseInt(userId)) {
	//         return users[i];
	//       }
	//     }
	//     return null;
	//   }
	// };
})




	// var giphyQuery = 'http://api.giphy.com/v1/gifs/search?q=funny+cat&api_key=dc6zaTOxFJmzC'
	// $http.get(giphyQuery).then(
	//  	function (result) {
	// 		console.log(result)
	//  	}, function (result) {
	//  		console.log(ressult)
	//  	});