'use strict';

angular.module('rssApp')
  .controller('NavbarCtrl', function ($scope, $location, $rootScope, $cookieStore) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.isCollapsed = true;

    $scope.isActive = function() {
      //return route === $location.path();
    };

    $scope.logOut = function() {
       $cookieStore.put('globals', {});
       $cookieStore.put('keys', {});
       $location.path('/login');
     };

  });