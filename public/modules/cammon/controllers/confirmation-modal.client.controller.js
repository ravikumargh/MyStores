'use strict';

angular.module('confirmationmodal').controller('ConfirmationModalController',
['$scope', '$stateParams', '$location', 'Authentication', '$modalInstance', 'ParentScope',
	function($scope, $stateParams, $location, Authentication, $modalInstance, ParentScope) {
 
		$scope.authentication = Authentication;
		$scope.message = ParentScope.message;
		
		$scope.ok = function() {
			//ParentScope.create(store, $scope.file);			
			$modalInstance.close(ParentScope.selectedItem);
		}; 

		$scope.cancel = function () {
		    $modalInstance.dismiss('cancel');
		};
	}
]);
 