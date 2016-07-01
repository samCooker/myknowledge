/**
 * Created by cookie on 2016/6/28.
 */
(function () {
    appModule
        .config(barcodeRouter)
        .controller('barcodeController',BarcodeController)
    ;

    function barcodeRouter($stateProvider){
        $stateProvider
            .state('barcode', {
                url: '/barcode',
                controller: 'barcodeController',
                templateUrl: 'modules/barcode/barcode.html'
            })
        ;
    }

    /**
     *
     */
    function BarcodeController($scope){

        $scope.barcode={};
        $scope.format="QR_CODE";

        $scope.barcodeScan = function () {
            cordova.plugins.barcodeScanner.scan(
                function (result) {
                    $scope.barcode.text=result.text;
                    $scope.barcode.format=result.format;
                    alert("We got a barcode\n" +
                        "Result: " + result.text + "\n" +
                        "Format: " + result.format + "\n" +
                        "Cancelled: " + result.cancelled);
                },
                function (error) {
                    alert("Scanning failed: " + error);
                },
                {
                    "preferFrontCamera" : false, // iOS and Android
                    "showFlipCameraButton" : true, // iOS and Android
                    "prompt" : "Place a barcode inside the scan area", // supported on Android only
                    "formats" : $scope.format, // default: all but PDF_417 and RSS_EXPANDED
                    "orientation" : "landscape" // Android only (portrait|landscape), default unset so it rotates with the device
                }
            );
        };

    }
})();