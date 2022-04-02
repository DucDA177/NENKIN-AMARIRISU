angular.module('WebApiApp').controller('ConfigurationController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings) {
    $scope.item = {
        Figure1: 0.0,
        Figure2: 0.0,
        Figure3: 0.0,
        Figure4: 0.0
    }
    $scope.isShowAddNew = false;
    $scope.handleAddNew = function () {
        $scope.isShowAddNew = !$scope.isShowAddNew;
    }
    $scope.Del = function (Id) {
        if (confirm('Bạn có chắc chắn muốn xóa đối tượng này ?'))
            $http({
                method: 'GET',
                url: 'api/Configuration/Delete?Id=' + Id,
            }).then(function successCallback(response) {
                toastr.success('Xóa dữ liệu thành công !', 'Thông báo');
                $rootScope.LoadConfiguration();
            }, function errorCallback(response) {
                toastr.error('Có lỗi trong quá trình xóa dữ liệu !', 'Thông báo');
            });

    }

    $scope.Save = function () {
        $http({
            method: 'POST',
            url: 'api/Configuration/Save',
            data: $scope.item
        }).then(function successCallback(response) {
            $scope.item = {
                Figure1: 0.0,
                Figure2: 0.0,
                Figure3: 0.0,
                Figure4: 0.0
            }
            $scope.itemError = null;
            toastr.success('Đã lưu dữ liệu thành công !', 'Thông báo');
            $rootScope.LoadConfiguration();
            $scope.handleAddNew();
        }, function errorCallback(response) {
            $scope.itemError = response.data;
            toastr.error('Vui lòng điền đầy đủ các trường bắt buộc !', 'Thông báo');
        });

    }

    $rootScope.LoadConfiguration = function () {

        $http({
            method: 'GET',
            url: 'api/Configuration/GetAll',
        }).then(function successCallback(response) {

            $scope.Configuration = response.data;

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }

    $rootScope.LoadConfiguration();
    
}]);