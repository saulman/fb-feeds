'use strict';

angular.module('rssApp')
  .controller('ScrapCtrl', ['$scope','$state','$http','$location','$stateParams','$timeout','$cookieStore','$rootScope', function ($scope, $state, $http, $location, $stateParams,$timeout,$cookieStore,$rootScope) {
   
    $scope.someval = true;

    if ($scope.someval.length > 0) {
      $scope.someval = false;
    }

    var param = $stateParams.id;

     $http.get('/api/feeds/' + param).success(function(feed) {
          $scope.feed = feed;
      })
     .error(function() {
          $state.go('main', {});
      });


   $scope.loading = false;
    $scope.syncFeed = function(maxLimit, nextURL) {
        if (maxLimit > 0){

        }
        $scope.loading = true;

        $('.progress-bar').animate({
            width: '15%'
        }, 100);

        var fbURL = '';
        var lastChar = '';

        if ($scope.feed !== null){
          fbURL = $scope.feed.url;
          lastChar = fbURL.charAt(fbURL.length - 1);
          if (lastChar === '/') {
            fbURL = fbURL.slice(0,-1);
          }

          fbURL = fbURL.split('/').pop();
          console.log(fbURL);
        } else {
          alert('Fb feed undefined');
        }
        var keys = {}; 
        keys = $cookieStore.get('keys') || {};
       console.log(keys.accessToken);
        var access_token = keys.accessToken;

       


        $scope.posts = {};

        function checkPost(postID) {
          return $http.get('https://graph.facebook.com/' + postID + '?fields=id,name,description,source,picture,full_picture,likes.summary(true),link,type')
            .success(function(data) {

                var ahref = '';
                var format = '';

                if (data.type === 'photo') {

                  ahref = data.full_picture;
                  format = 'photo';
                } else if (data.type === 'video' && data.source !== undefined) {
                  ahref =  data.source;
                  format = 'video';
                } else if (data.type === 'link') {
                  ahref =  data.link;
                  format = 'link';
                } else if (data.type === 'status'){
                  ahref = '';
                  format = 'text';
                }

                $scope.posts[data.id] = { 
                                    'id'          : data.id,
                                    'likes'       : data.likes,
                                    'type'        : data.type,
                                    'description' : data.description,
                                    'full_picture': data.full_picture,
                                    'picture'     : data.picture,
                                    'ahref'       : ahref,
                                    'format'      : format
                                  };

                $('.progress-bar').animate({
                      width: '100%'
                }, 500);

                $scope.loading = false;


                
            })
            .error(function() {
                $rootScope.errFeed = true;
                $location.path('/');
            });
        }


        function getFeed(maxLimit, feedID) {
          return $http.get('https://graph.facebook.com/' + feedID + '/feed?access_token=' + access_token + '&limit='+maxLimit)
            .success(function(fbFeed) {

              if(fbFeed.paging){
                $scope.fbNextFeed = fbFeed.paging.next;

                $scope.fbPreviousFeed = fbFeed.paging.previous;
              }
              
              console.log($scope.fbNextFeed);
              $('.progress-bar').animate({
                      width: '66%'
                  }, 500);


               angular.forEach(fbFeed.data, function(value){
                  // add value, key to print values
                  checkPost(value.id);
              });
               
            })
            .error(function() {
                alert('Error reading feed');
            });
        }

        function getNextFeed(nextURL) {
          return $http.get(nextURL)
            .success(function(fbNextFeed) {
               
              if(fbNextFeed.paging){
                $scope.fbNextFeed = fbNextFeed.paging.next;

                $scope.fbPreviousFeed = fbNextFeed.paging.previous;
              }

               angular.forEach(fbNextFeed.data, function(value){
                  checkPost(value.id);
                  console.log(value.id);
              });

                  $('.progress-bar').animate({
                      width: '66%'
                  }, 500);
            })
            .error(function() {
                alert('Error reading feed');
            });
        }

        function getFBPageID(fbURL,access_token) {
          return $http.get('https://graph.facebook.com/' + fbURL + '?access_token=' + access_token)
            .success(function(pageData) {
                //console.log(pageData  )
                if (pageData.id.length > 0){
                  getFeed(maxLimit,pageData.id);
                } else {
                  alert('Error getting feedID');
                }

                $('.progress-bar').animate({
                    width: '33%'
                }, 500);

            })
            .error(function(response) {
              console.log('response');
              console.log(response);
              $scope.error = { message : response.error.message };
              $scope.errorMessage = true;
              angular.element('#errorMessageButton').click();
                //alert("Page doesn't exist");
                 //$location.path('/');
            });
        }

        if (nextURL !== undefined) {
          getNextFeed(nextURL);
        } else {
          getFBPageID(fbURL, access_token);
        }
        
      };



      $scope.redirect = function() {
        //$rootScope.reload = true;
        //$state.go('login');
        $state.go('login', {reload: true});
      };
  }]);






