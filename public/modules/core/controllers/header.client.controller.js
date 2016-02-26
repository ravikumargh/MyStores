'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', 'Cities',
	function($scope, Authentication, Menus, Cities) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});

		$scope.find = function() {
			$scope.cities = Cities.query();
			if (localStorage.MyCity) {
				$scope.selectedCity=localStorage.MyCity;			    
			}
		};
		$scope.init = function() {
			$scope.find();		
		};
		$scope.updateLocation = function() {				
			localStorage.setItem("MyCity", $scope.selectedCity);	
		};

	}
]);