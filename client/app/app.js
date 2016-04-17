(function () {
'use strict';

angular.module('rssApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap'
])

  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
     $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .state('scrapId', {
        url: '/scrap/:id',
        templateUrl: 'app/scrap/scrap.html',
        controller: 'ScrapCtrl'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'app/login/login.view.html',
        controller: 'LoginController'
      })
      .state('register', {
        url: '/register',
        templateUrl: 'app/register/register.view.html',
        controller: 'RegisterController'
      });

       $urlRouterProvider.otherwise('/');


    $locationProvider.html5Mode(true);
  });







angular.module('rssApp').service('FBPageFeed', function ($http, $resource) {
    var feedID = '293155980850198' // kaimietis
    var access_token = '1565285873784001|eUwsvx-2sSuejc_o70AO1rnZ-lY';
    var limit = '20';



    var promise = $http.get('https://graph.facebook.com/' + feedID + '/feed?access_token=' + access_token + '&limit=100').
    success(function (fbFeed) {
        //angular.forEach(fbFeed.data, function(value, key){
      //      $scope.fbPost = []
            //var fbPostLink = 'https://graph.facebook.com/606572516175208' // kaimietis
      //      var promise2 = $http.get('https://graph.facebook.com/' + value.id).success(function(fbPost) {
     //         $scope.fbPost[value.id] = fbPost;
       //     });

 //        });

        return fbFeed.data;
    });
    return promise;
}) // other stuf


angular.module('rssApp').factory('facebookService', function($q) {
    return {
        getMyLastName: function() {
            var deferred = $q.defer();
            FB.api('/me', {
                fields: 'last_name'
            }, function(response) {
                console.log(response)
                if (!response || response.error) {
                    deferred.reject('Error occured');
                } else {
                    deferred.resolve(response);
                }
            });
            return deferred.promise;
        }
    }

});

angular.module('rssApp').factory('facebookService', function($q) {
  
    return {
        getMyAuthToken: function() {
                 var deferred = $q.defer();
                FB.getLoginStatus(function(response) {
                if (response.status === 'connected') {
                  // the user is logged in and has authenticated your
                  // app, and response.authResponse supplies
                  // the user's ID, a valid access token, a signed
                  // request, and the time the access token 
                  // and signed request each expire
                   deferred.resolve(response);
                } else {
                    var err = { error : "User is not authorized or logged in"}
                   deferred.resolve(err);
                }
                 return response;
             });
            return deferred.promise;
        }
    }
});





  angular.module('rssApp')
  .run(['$rootScope', '$location', '$cookieStore', '$http', function($rootScope, $location, $cookieStore, $http) {



    $rootScope.currentUser = $cookieStore.get('currentUser') || {};
    $rootScope.keys = $cookieStore.get('keys') || {};
     console.log( $rootScope.keys)
        if ($rootScope.currentUser) {
            //$http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
          //  $cookieStore.put('globals', $rootScope.globals);
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login']) === -1;
            var loggedIn = $rootScope.currentUser;
            console.log(!loggedIn)
            if (restrictedPage && !loggedIn) {
              console.log("!loggedIn")
               $location.path('/login');
            }
        });
  }]);



  




/*
   run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];
    function run($rootScope, $location, $cookieStore, $http) {

        console.log("load")
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }
        });
    }
*/


})();