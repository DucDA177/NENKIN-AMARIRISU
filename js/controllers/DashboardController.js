angular.module('WebApiApp').controller('DashboardController', function ($rootScope, $scope, $http, $timeout, $cookies) {
    $scope.LoadGenernalInfo = function () {
        $http({
            method: "GET",
            url: "api/Chart/GeneralInfo",
        }).then(
            function successCallback(response) {
                $scope.GeneralInfo = response.data;
            },
            function errorCallback(response) {
                toastr.error("Có lỗi trong quá trình tải dữ liệu!", "Thông báo");
            }
        );
    };
    $scope.LoadGenernalInfo();

    $scope.LoadListInfoError = function () {
       
        $http({
            method: "GET",
            url: "api/Chart/ListInfoError",
        }).then(
            function successCallback(response) {
                $scope.ChartListInfoError(response.data);
            },
            function errorCallback(response) {
                toastr.error("Có lỗi trong quá trình tải dữ liệu!", "Thông báo");
            }
        );
    };
    $scope.LoadListInfoError();

    $scope.ChartListInfoError = function (data) {
        am4core.ready(function () {

            // Themes begin

            am4core.useTheme(am4themes_animated);
            // Themes end

            var chart = am4core.create("chartdivListInfoError", am4charts.PieChart3D);
            chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

            chart.legend = new am4charts.Legend();

            chart.data = data;
            var title = chart.titles.create();
            title.text = "BIỂU ĐỒ THỐNG KÊ SỐ LƯỢNG HỒ SƠ LỖI";
            title.fontSize = 15;
            title.fontWeight = 600;

            var series = chart.series.push(new am4charts.PieSeries3D());
            series.dataFields.value = "value";
            series.dataFields.category = "name";

            chart.exporting.menu = new am4core.ExportMenu();
            chart.exporting.menu.items = [
                {
                    "label": "...",
                    "menu": [
                        {
                            "label": "Ảnh",
                            "menu": [
                                { "type": "png", "label": "PNG" },
                                { "type": "jpg", "label": "JPG" },
                                { "type": "svg", "label": "SVG" },
                                { "type": "pdf", "label": "PDF" }
                            ]
                        }, {
                            "label": "Tệp",
                            "menu": [
                                { "type": "xlsx", "label": "Excel" },
                                { "type": "pdfdata", "label": "PDF" }
                            ]
                        }, {
                            "label": "In", "type": "print"
                        }
                    ]
                }
            ];

        }); // end am4core.ready()

    }

    $scope.LoadListInfoPaid = function () {

        $http({
            method: "GET",
            url: "api/Chart/ListInfoPaid",
        }).then(
            function successCallback(response) {
                $scope.ChartListInfoPaid(response.data);
            },
            function errorCallback(response) {
                toastr.error("Có lỗi trong quá trình tải dữ liệu!", "Thông báo");
            }
        );
    };
    $scope.LoadListInfoPaid();

    $scope.ChartListInfoPaid = function (data) {
        am4core.ready(function () {

            // Themes begin

            am4core.useTheme(am4themes_animated);
            // Themes end

            var chart = am4core.create("chartdivListInfoPaid", am4charts.PieChart3D);
            chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

            chart.legend = new am4charts.Legend();

            chart.data = data;
            var title = chart.titles.create();
            title.text = "BIỂU ĐỒ THỐNG KÊ SỐ LƯỢNG HỒ SƠ ĐÃ THANH TOÁN";
            title.fontSize = 15;
            title.fontWeight = 600;

            var series = chart.series.push(new am4charts.PieSeries3D());
            series.dataFields.value = "value";
            series.dataFields.category = "name";

            chart.exporting.menu = new am4core.ExportMenu();
            chart.exporting.menu.items = [
                {
                    "label": "...",
                    "menu": [
                        {
                            "label": "Ảnh",
                            "menu": [
                                { "type": "png", "label": "PNG" },
                                { "type": "jpg", "label": "JPG" },
                                { "type": "svg", "label": "SVG" },
                                { "type": "pdf", "label": "PDF" }
                            ]
                        }, {
                            "label": "Tệp",
                            "menu": [
                                { "type": "xlsx", "label": "Excel" },
                                { "type": "pdfdata", "label": "PDF" }
                            ]
                        }, {
                            "label": "In", "type": "print"
                        }
                    ]
                }
            ];

        }); // end am4core.ready()

    }


    $scope.LoadListInfoType = function () {

        $http({
            method: "GET",
            url: "api/Chart/ListInfoType",
        }).then(
            function successCallback(response) {
                $scope.ChartListInfoType(response.data);
            },
            function errorCallback(response) {
                toastr.error("Có lỗi trong quá trình tải dữ liệu!", "Thông báo");
            }
        );
    };
    $scope.LoadListInfoType();

    $scope.ChartListInfoType = function (data) {
        am4core.ready(function () {

            // Themes begin
            am4core.useTheme(am4themes_animated);
            // Themes end

            // Create chart instance
            var chart = am4core.create("chartdivListInfoType", am4charts.XYChart);

            // Add data
            chart.data = data;

            var title = chart.titles.create();
            title.text = "BIỂU ĐỒ PHÂN LOẠI HỒ SƠ THEO ĐỢT NHẬP LIỆU";
            title.fontSize = 15;
            title.fontWeight = 600;
            // Create axes

            var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "name";
            categoryAxis.renderer.grid.template.location = 0;
            categoryAxis.renderer.minGridDistance = 20;

            categoryAxis.renderer.labels.template.adapter.add("dy", function (dy, target) {
                if (target.dataItem && target.dataItem.index & 2 == 2) {
                    return dy + 25;
                }
                return dy;
            });

            var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

            // Create series
            var series = chart.series.push(new am4charts.ColumnSeries());
            series.dataFields.valueY = "value";
            series.dataFields.categoryX = "name";
            series.name = "value";
            series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
            series.columns.template.fillOpacity = .8;
            series.columns.template.adapter.add("fill", function (fill, target) {
                return chart.colors.getIndex(target.dataItem.index);
            });
            var columnTemplate = series.columns.template;
            columnTemplate.strokeWidth = 2;
            columnTemplate.strokeOpacity = 1;

            chart.scrollbarX = new am4core.Scrollbar();
            chart.scrollbarY = new am4core.Scrollbar();

            chart.exporting.menu = new am4core.ExportMenu();
            chart.exporting.menu.items = [
                {
                    "label": "...",
                    "menu": [
                        {
                            "label": "Ảnh",
                            "menu": [
                                { "type": "png", "label": "PNG" },
                                { "type": "jpg", "label": "JPG" },
                                { "type": "svg", "label": "SVG" },
                                { "type": "pdf", "label": "PDF" }
                            ]
                        }, {
                            "label": "Tệp",
                            "menu": [
                                { "type": "xlsx", "label": "Excel" },
                                { "type": "pdfdata", "label": "PDF" }
                            ]
                        }, {
                            "label": "In", "type": "print"
                        }
                    ]
                }
            ];
        }); // end am4core.ready()
    }
});
