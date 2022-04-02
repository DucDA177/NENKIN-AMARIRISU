angular.module('WebApiApp').controller('ListController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings) {
    $scope.item = {
        Name: '',
        Year: new Date().getFullYear()
    };
    $scope.isShowAddNew = false;
    $scope.handleAddNew = function () {
        $scope.isShowAddNew = !$scope.isShowAddNew;
    }
    $scope.Edit = function (item) {
        $scope.item = item;
        $scope.handleAddNew();
        window.scrollTo(0, 0);
    }
    $scope.Del = function (Id) {
        if (confirm('Bạn có chắc chắn muốn xóa đối tượng này ?'))
            $http({
                method: 'GET',
                url: 'api/List/Delete?Id=' + Id,
            }).then(function successCallback(response) {
                toastr.success('Xóa dữ liệu thành công !', 'Thông báo');
                $rootScope.LoadList();
            }, function errorCallback(response) {
                toastr.error('Có lỗi trong quá trình xóa dữ liệu !', 'Thông báo');
            });

    }

    $scope.Save = function () {
        $http({
            method: 'POST',
            url: 'api/List/Save',
            data: $scope.item
        }).then(function successCallback(response) {
            $scope.item = {
                Name: '',
                Year: new Date().getFullYear()
            };
            $scope.itemError = null;
            toastr.success('Đã lưu dữ liệu thành công !', 'Thông báo');
            $rootScope.LoadList();
            $scope.handleAddNew();
        }, function errorCallback(response) {
            $scope.itemError = response.data;
            toastr.error('Vui lòng điền đầy đủ các trường bắt buộc !', 'Thông báo');
        });

    }

    $scope.Paging = {
        "searchKey": '',
        "pageSize": 15,
        "totalCount": 0,
        "totalPage": 0,
        "currentPage": 1,
    };
    $scope.PrePage = function () {
        if ($scope.Paging.currentPage > 1) {
            $scope.Paging.currentPage = $scope.Paging.currentPage - 1;
            $rootScope.LoadList();
        }

    }
    $scope.NextPage = function () {
        if ($scope.Paging.currentPage < $scope.Paging.totalPage) {
            $scope.Paging.currentPage = $scope.Paging.currentPage + 1;
            if ($scope.Paging.currentPage == $scope.Paging.totalPage) {
                $scope.Paging.currentPage == $scope.Paging.totalPage
            }
            $rootScope.LoadList();
        }

    }

    $rootScope.LoadList = function () {

        if ($scope.Paging.totalPage != 0) {
            if ($scope.Paging.currentPage > $scope.Paging.totalPage)
                $scope.Paging.currentPage = $scope.Paging.totalPage
            if ($scope.Paging.currentPage < 1)
                $scope.Paging.currentPage = 1
        }

        $http({
            method: 'GET',
            url: 'api/List/GetAll?pageNumber='
                + $scope.Paging.currentPage
                + '&pageSize=' + $scope.Paging.pageSize
                + '&searchKey=' + $scope.Paging.searchKey
        }).then(function successCallback(response) {

            $scope.List = response.data.ListOut;
            $scope.Paging.totalCount = response.data.totalCount;
            $scope.Paging.pageStart = response.data.pageStart;
            $scope.Paging.totalPage = response.data.totalPage;



        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }

    $rootScope.LoadList();

}]);