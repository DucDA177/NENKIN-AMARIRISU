angular.module('WebApiApp').controller('SearchByPassportNumberController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', '$stateParams', '$compile', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings, $stateParams, $compile) {
    if (!window.location.href.includes('search.html')) {
        window.location.replace("/search.html");
    }
    $scope.PassportNumber = '';
    $scope.PhoneNumber = '';
    $scope.showLoading = false;
    $scope.Search = function () {
        $scope.showLoading = true;
        
        $http({
            method: 'GET',
            url: 'api/ListInfo/SearchByPassportNumber?PassportNumber=' + $scope.PassportNumber
                + '&PhoneNumber=' + $scope.PhoneNumber,
        }).then(function successCallback(response) {
            $scope.data = response.data;
            $scope.showLoading = false;
            if (!$scope.data)
                toastr.warning('Không có hồ sơ nào được tìm thấy', 'Thông báo');
        }, function errorCallback(response) {
            toastr.warning(response.data.Message, 'Thông báo');
            $scope.data = null;
            $scope.showLoading = false;
        });

    }


}]);