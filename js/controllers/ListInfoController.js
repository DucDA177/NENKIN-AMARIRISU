angular.module('WebApiApp').controller('ListInfoController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', '$stateParams', '$compile', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings, $stateParams, $compile) {
    
    $scope.Del = function (Id) {
        if (confirm('Bạn có chắc chắn muốn xóa đối tượng này ?'))
            $http({
                method: 'GET',
                url: 'api/ListInfo/Delete?Id=' + Id,
            }).then(function successCallback(response) {
                toastr.success('Xóa dữ liệu thành công !', 'Thông báo');
                $rootScope.LoadHS();
            }, function errorCallback(response) {
                toastr.error('Có lỗi trong quá trình xóa dữ liệu !', 'Thông báo');
            });

    }

    $scope.LoadListColumn = function () {

        $http({
            method: 'GET',
            url: 'api/ListInfo/GetListColumn',
        }).then(function successCallback(response) {
            $scope.ListColumn = response.data;
            let listNotDisplay = ['Id', 'IdList', 'IsError', 'FInUse',
                'CreatedBy', 'CreatedAt', 'UpdatedBy', 'UpdatedAt'];
            $("#fixTable th").not('.parent-header').each(function (index,e) {
                angular.forEach($scope.ListColumn, function (value, key) {
                    if (value.Name == e.id) {
                        let dislayName = e.innerHTML.split("<br>")[0].replace('\n', '')
                        value.DisplayName = dislayName;

                        if (!listNotDisplay.includes(value.Name))
                            value.IsDisplay = true;
                    }
                });
            });
            $rootScope.LoadHS();
        }, function errorCallback(response) {
            toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
        });

    }
    $scope.LoadListColumn();

    $scope.LoadListConfig = function () {

        $http({
            method: 'GET',
            url: 'api/List/GetListConfig?Id=' + $stateParams.Id,
        }).then(function successCallback(response) {
            $rootScope.ListConfig = response.data;
            if ($rootScope.ListConfig == null || $rootScope.ListConfig == undefined) {
                window.history.back();
            }
        }, function errorCallback(response) {
            toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
        });

    }
    $scope.LoadListConfig();

    $scope.Paging = {
        "pageSize": 50,
        "totalCount": 0,
        "totalPage": 0,
        "currentPage": 1,
    };
    $scope.PrePage = function () {
        if ($scope.Paging.currentPage > 1) {
            $scope.Paging.currentPage = $scope.Paging.currentPage - 1;
            $rootScope.LoadHS();
        }

    }
    $scope.NextPage = function () {
        if ($scope.Paging.currentPage < $scope.Paging.totalPage) {
            $scope.Paging.currentPage = parseInt($scope.Paging.currentPage) + 1;
            if ($scope.Paging.currentPage == $scope.Paging.totalPage) {
                $scope.Paging.currentPage == $scope.Paging.totalPage
            }
            $rootScope.LoadHS();
        }

    }

    $rootScope.LoadHS = function () {
        if ($scope.Paging.totalPage != 0) {
            if ($scope.Paging.currentPage > $scope.Paging.totalPage)
                $scope.Paging.currentPage = $scope.Paging.totalPage
            if ($scope.Paging.currentPage < 1)
                $scope.Paging.currentPage = 1
        }
        $scope.ListColumn.filter(t => t.Name == 'IdList')[0].value = $stateParams.Id;
        $scope.ListColumn.filter(t => t.Name == 'FInUse')[0].value = true;
        let data = {
            pageNumber: $scope.Paging.currentPage,
            pageSize: $scope.Paging.pageSize,
            searchFilters: $scope.ListColumn
        }
        $http({
            method: 'POST',
            url: 'api/ListInfo/GetAll',
            data: data
        }).then(function successCallback(response) {

            $scope.ListInfo = response.data.ListData;
            $scope.Paging.totalCount = response.data.totalCount;
            $scope.Paging.pageStart = response.data.pageStart;
            $scope.Paging.totalPage = response.data.totalPage;
            

        }, function errorCallback(response) {
            toastr.warning('Có lỗi trong quá trình tải dữ liệu!', 'Thông báo');
        });
    }
    
    
    $scope.$on('$viewContentLoaded', function () {
        $("#fixTable th").not('.parent-header').click(function (e) {
            let arrowUp = "▲";
            let arrowDown = "▼";
            let innerHTML = e.target.innerHTML;

            $("#fixTable th").not('.parent-header').each(function (index, elem) {

                let elemHtml = elem.innerHTML;

                if (elem.innerHTML != innerHTML) {

                    if (elemHtml.includes(arrowUp))
                        elem.innerHTML = elemHtml.replace(arrowUp, '');
                    if (elemHtml.includes(arrowDown))
                        elem.innerHTML = elemHtml.replace(arrowDown, '');
                }

                angular.forEach($scope.ListColumn, function (value, key) {
                    value.IsSortable = false;
                    value.IsDescending = false;
                });
            })

            let selectedColumn = $scope.ListColumn.filter(t => t.Name == e.target.id)[0];
            selectedColumn.IsSortable = true;

            if (innerHTML.includes(arrowUp)) {
                e.target.innerHTML = innerHTML.replace(arrowUp, arrowDown);
                selectedColumn.IsDescending = true;
            }
            else if (innerHTML.includes(arrowDown)) {
                e.target.innerHTML = innerHTML.replace(arrowDown, '');
                selectedColumn.IsSortable = false;
            }
            else
                e.target.innerHTML = innerHTML + arrowUp;


            $rootScope.LoadHS();
        });
    });

}]);