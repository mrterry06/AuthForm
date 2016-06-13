var result;
var app = angular.module('myApp', ['ngRoute'])

.controller('myCtrl', ['$scope', '$http', '$rootScope', '$location', function($scope, $http, $rootScope, $location){
	$scope.hello = 'Hello';
	console.log(window.localStorage);

function refresh(){
	 $http.get('/reps')
 		.success(function(data){
 		$scope.logs = data;
 			if(window.localStorage !== 0){ 
 				$scope.log = window.localStorage;
 				console.log(window.localStorage);
 			}
 		})
 		.error(function(err){
 		console.log(err);
 		});

};

refresh();

$scope.Store = function(){	
	$http.post('reps', $scope.log)
	.success(function(response){
		console.log(response);
window.localStorage.setItem('user', response.user);
window.localStorage.setItem('pass', $scope.log.pass);
	refresh();	
	});
	
};

$scope.remove = function(id){
	console.log(id);
$http.delete('/reps/' + id)
.success(function(response){
	refresh();
});	
}

$scope.compare = function(){
	$http.put('/reps', $scope.log)
	.success(function(response){
		if(response === false){
			$scope.there = "I'm Sorry invalid username/password!";
		} else {
		$scope.there = response;
		$scope.log = '';
		$rootScope.loggedIn = true;
		$location.path('/landing');
	}
	});
}


}]);

app.config(function($routeProvider){
	$routeProvider
		.when('/', {
			templateUrl: './views/sign.html'
		})
		.when('/landing', {
			resolve: {
				"check": function($location, $rootScope){
					if(!$rootScope.loggedIn){
						$location.path('/');
					}
				}
			},
			templateUrl: './views/landing.html',

		})
		.otherwise({
			redirect: '/'
		})

});


