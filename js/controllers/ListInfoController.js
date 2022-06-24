angular.module('WebApiApp').controller('ListInfoController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', '$stateParams', '$compile', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings, $stateParams, $compile) {
    $scope.Check = false;
    if (!$rootScope.SelectedHoSoQL)
        $rootScope.SelectedHoSoQL = []

    $rootScope.GetListCTV();

    $rootScope.OnClickContext = function (action) {
        let index = parseInt($('#context').attr('data-index')) - 1;

        switch (action){
            case 'check':
                debugger
                $scope.ListInfo[index].Check = !$scope.ListInfo[index].Check
                $scope.OnCheck($scope.ListInfo[index])
                $scope.$apply()
                break;
            case 'edit':
                $scope.openModal($scope.ListInfo[index], 'CreateData', 1)
                break;
            case 'calculate':
                $scope.openModal($scope.ListInfo[index], 'CreateData', 2)
                break;
            case 'delete':
                $scope.Del($scope.ListInfo[index].Id)
                break;
        }
    }


    $scope.OnCheckAll = function () {
        angular.forEach($scope.ListInfo, function (value, key) {
            value.Check = $scope.Check;
            $scope.OnCheck(value)
        });
    }

    $scope.OnCheck = function (item) {
        
        let check = $rootScope.SelectedHoSoQL.filter(t => t.Id != item.Id)

        if (item.Check && check.length == $rootScope.SelectedHoSoQL.length) {
            $rootScope.SelectedHoSoQL.push(item)
        }
        if (!item.Check && check.length != $rootScope.SelectedHoSoQL.length) {
            $rootScope.SelectedHoSoQL = check
        }

    }

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
            $("#fixTable th").not('.parent-header').each(function (index,e) {
                angular.forEach($scope.ListColumn, function (value, key) {
                    if (value.Name == e.id) {
                        let dislayName = e.innerHTML.split("<br>")[0].replace('\n', '')
                        value.DisplayName = dislayName;

                        if (!listNotDisplay.includes(value.Name))
                            value.IsDisplay = true;
                    }
                    if (value.Name == 'TicketWindow') {
                        value.ExactMatch = true;
                        if ($rootScope.onlyCTV)
                            value.Value = $rootScope.user.UserName
                    }
                        
                    if (value.Name == 'IdList')
                        value.Value = $stateParams.Id;
                    if (value.Name == 'FInUse')
                        value.Value = true;
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

            $scope.Check = true;
            angular.forEach($scope.ListInfo, function (value, key) {
                if ($rootScope.SelectedHoSoQL.filter(t => t.Id == value.Id).length > 0)
                    value.Check = true;
                else
                    $scope.Check = false;
            });

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