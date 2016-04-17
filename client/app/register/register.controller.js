(function () {
    'use strict';

    angular
        .module('rssApp')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['UserService', '$http','$scope', '$location', '$rootScope', 'FlashService'];
    function RegisterController(UserService, $http, $scope, $location, $rootScope, FlashService) {
        




        $scope.register = function() {
            if($scope.user === '') {
               return;
            }
            $http.post('/api/users', $scope.user)
             .then(function (response) {
                    if (response.success) {
                        //$location.path('/login');
                        console.log("success")
                        } else {
                        console.log("err")
                         $scope.dataLoading = false;
                        }
                });
           // $http.post('/api/things', { info: $scope.newThing });
           // $scope.newThing = '';
            $scope.dataLoading = true;
            
            /*UserService.Create($scope.user)
                .then(function (response) {
                    if (response.success) {
                        FlashService.Success('Registration successful', true);
                        console.log(response)
                        //$location.path('/login');
                    } else {
                        FlashService.Error(response.message);
                         $scope.dataLoading = false;
                    }
                });
            */
        }
    }

})();
