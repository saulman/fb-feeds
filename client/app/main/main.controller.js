'use strict';

angular.module('rssApp').controller('MainCtrl', ['$scope','$http','$location','$rootScope', function ($scope, $http, $location,$rootScope) {
    console.log('MainCtrl');

    $scope.feeds = {};
    $http.get('/api/feeds').success(function(feeds) {
      $scope.feeds = feeds;
    });

    console.log('feedExceeded:' + $rootScope.errFeed);
    if ($rootScope.errFeed !== 'undefined'){

      $scope.feedError = true;

    }
    $scope.addFeed = function() {
        
        
        $http.post('/api/feeds', {   url : $scope.feed.url, 
                                    name : $scope.feed.name,
                                    text : $scope.feed.gtext,
                                    image :  $scope.feed.gimage,
                                    video :  $scope.feed.gvideo }).success(function() {
        });

        location.reload() ;                           
     };

    $scope.clear = function() {
       $scope.feed = {};
     };

    $scope.addThing = function() {
        
        if($scope.newThing === '') {
          return;
        }

        $http.post('/api/things', { info: $scope.newThing });
        $scope.newThing = '';
    };



    $scope.deleteFeed = function(feedID) {
      if (confirm('Are you sure that you want to delele' + feedID.name + 'feed?')) {
        $http.delete('/api/feeds/' + feedID.id).success(function() {
           location.reload();
        });
      }
    };

  }]);






