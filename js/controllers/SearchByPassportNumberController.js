angular.module('WebApiApp').controller('SearchByPassportNumberController', ['$rootScope', '$scope', '$http', '$cookies', '$uibModal', '$settings', '$stateParams', '$compile', function ($rootScope, $scope, $http, $cookies, $uibModal, $settings, $stateParams, $compile) {
    $scope.PassportNumber = '';
    $scope.Search = function () {
            $http({
                method: 'GET',
                url: 'api/ListInfo/SearchByPassportNumber?PassportNumber=' + $scope.PassportNumber,
            }).then(function successCallback(response) {
                $scope.data = response.data;
                }, function errorCallback(response) {
                    toastr.error(response.data.Message, 'Thông báo');
                    $scope.PassportNumber = '';
            });

    }
    $scope.LoadDataView = function () {

        $http({
            method: 'GET',
            url: 'views-client/template/ListInfo.html',
        }).then(function successCallback(response) {
            var jHtmlObject = jQuery(response.data);
            var editor = jQuery("<p>").append(jHtmlObject);
            $scope.LoadListColumn(editor);
        }, function errorCallback(response) {
            toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
        });

    }
    $scope.LoadListColumn = function (editor) {

        $http({
            method: 'GET',
            url: 'api/ListInfo/GetListColumn',
        }).then(function successCallback(response) {
            $scope.ListColumn = response.data;
            let listNotDisplay = ['Id', 'IdList', 'IsError', 'FInUse',
                'CreatedBy', 'CreatedAt', 'UpdatedBy', 'UpdatedAt'];
            editor.find("#fixTable th").not('.parent-header').each(function (index, e) {
                angular.forEach($scope.ListColumn, function (value, key) {
                    if (value.Name == e.id) {
                        let dislayName = e.innerHTML.split("<br>")[0].replace('\n', '')
                        value.DisplayName = dislayName;

                        if (!listNotDisplay.includes(value.Name))
                            value.IsDisplay = true;
                    }
                });
            });
        }, function errorCallback(response) {
            toastr.error('Có lỗi trong quá trình tải dữ liệu !', 'Thông báo');
        });

    }

    $scope.LoadDataView();

}]);