app.directive('preventDefault', function () {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                elem.on('click', function (e) {
                    e.preventDefault();
                });
            }
        }
    };
});

app.directive("ngFileToPreview", function (FileReaderService) {
    var getFile = function () {
        FileReaderService.readAsDataUrl($scope.uploadedImg.File, $scope)
            .then(function (result) {
                $scope.tempImageSrc = result;
            });
    };
    return {
        link: function ($scope, el) {
            el.bind("change", function (e) {
                if ($scope.uploadedImg.File)
                    $scope.getFile();
            })
        }
    }
});