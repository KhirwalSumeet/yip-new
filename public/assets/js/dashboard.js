var app = angular.module('dashboard', ['xeditable']);

app.controller('dashboardController', function($scope, $http) {
    $scope.data = {};

    $http.post("./api/getAll").then(function(data) {
    	$scope.data = data.data;
	}, function errorHandeler(err) {
		console.log(err);
	});
    
    $scope.updateTeacher = function(data){
    	$http.post("./api/updateTeachers", {
    		phone: $scope.data.user.phone,
    		address: $scope.data.user.address,
    		emergency: $scope.data.user.emergency
    	}).then(function(result) {
    		console.log(result);
    	});
    }

    $scope.updateSchool = function(){
    	$http.post("./api/updateSchools", $scope.data.school).then(function() {
    		$http.post("./api/updateSchools", $scope.data.school);
    	});
    }

    $scope.updateTeam = function(){
    	$http.post("./api/updateTeams", $scope.data.teams).then(function() {
    		$http.post("./api/updateTeams", $scope.data.teams);
    	});
    }

    $scope.addMember = function(teams) {
    	teams.students.push({
    		name: '', 
			standard: '', 
			guardian: '',
			phone: ''
    	});
    	console.log($scope.data);
    }
    
    $scope.addTeam = function(data){
    	data.teams.push({
    		name: '',
    		students: [
    			{
    				name: '', 
					standard: '', 
					guardian: '',
					phone: ''
    			},
    			{
    				name: '', 
					standard: '', 
					guardian: '',
					phone: ''
    			}
    		]
    	});
    	main();
    }
});
app.run(function(editableOptions) {
	editableOptions.theme = 'bs3';
});