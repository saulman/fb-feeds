(function () {
    'use strict';

    angular
        .module('rssApp')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$scope','$state','$http','$location', 'AuthenticationService', 'FlashService', '$rootScope', '$cookieStore','$window','facebookService'];
    function LoginController($scope, $state, $http, $location, AuthenticationService, FlashService, $rootScope, $cookieStore, $window,facebookService) {


         //$scope.connected = false;

        console.log($rootScope.keys.accessToken == null)    
       if ($rootScope.keys.accessToken == null){
           // $scope.connected = false;
       }
       if ($state.params.reload == true){
            $state.reload();
       }
         var localuser = "admin";
         var localpass = "pienespukas"

        // Base64 encoding service used by AuthenticationService
    var Base64 = {

        keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    this.keyStr.charAt(enc1) +
                    this.keyStr.charAt(enc2) +
                    this.keyStr.charAt(enc3) +
                    this.keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = this.keyStr.indexOf(input.charAt(i++));
                enc2 = this.keyStr.indexOf(input.charAt(i++));
                enc3 = this.keyStr.indexOf(input.charAt(i++));
                enc4 = this.keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };
            AuthenticationService.ClearCredentials();
       
        function SetCredentials(username, password) {
            var authdata = Base64.encode(username + ':' + password);

            $rootScope.currentUser = {
                    username: username,
                    password: password
                }
           
            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
            $cookieStore.put('currentUser', $rootScope.currentUser);
        }



       $scope.login = function() {


            if ($scope.username == localuser && $scope.password == localpass){
                AuthenticationService.SetCredentials($scope.username, $scope.password);
                SetCredentials (localuser , localpass)
                $location.path('/');
            }
        };



        $window.fbAsyncInit = function() {
            FB.init({ 
               appId      : '465515803652776',
                cookie     : true,  // enable cookies to allow the server to access 
                                    // the session
                xfbml      : true,  // parse social plugins on this page
                version    : 'v2.5' // use graph api version 2.5
            });

            $scope.FBUser = facebookService.getMyAuthToken() 
             .then(function(response) {
               console.log(response)
               console.log(!response.error)
                if (!response.error) {
                    //console.log("connected")
                    $scope.connected = true
                    var APIKey = response.authResponse.accessToken;
                    $rootScope.keys = {
                                    accessToken: APIKey
                                }; 
                    $cookieStore.put('keys', $rootScope.keys);
                } else {
                    $scope.notconnected = true
                }
             }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.

                console.log("err: "  + response)
              });
          
        };


        (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);

    }(document, 'script', 'facebook-jssdk')); 


        function checkLoginState() {
        FB.getLoginStatus(function(response) {
          
          console.log ("checkLoginState fired")
          console.log (response)
        }); 
      }
             

        $scope.getMyLastName = function() {
           facebookService.getMyLastName() 
             .then(function(response) {
                console.log(response)
               $scope.last_name = response.last_name;
             } 

           )
        };


        


/*
              // This is called with the results from from FB.getLoginStatus().
            function statusChangeCallback(response) {
                // The response object is returned with a status field that lets the
                // app know the current login status of the person.
                // Full docs on the response object can be found in the documentation
                // for FB.getLoginStatus().
                if (response.status === 'connected') {

                    console.log ("connecteed fired")
                    $scope.isDisabled = false;
                    var APIKey = response.authResponse.accessToken;

                    console.log("connected. API Key - " + APIKey)
                    // Logged into your app and Facebook.
                    testAPI();

                    $rootScope.keys = {
                                    accessToken: APIKey
                                }; 
                    $cookieStore.put('keys', $rootScope.keys);

                     $state.go('login', {reload: true});
                } else {
                    // The person is not logged into Facebook, so we're not sure if
                    // they are logged into this app or not.
                    //console.log("not connected")
                }
            }

            // Here we run a very simple test of the Graph API after login is
            // successful.  See statusChangeCallback() for when this call is made.
            function testAPI() {
                FB.api('/me', function(response) {
                    console.log ("testAPI fired")
                    document.getElementById('status').innerHTML = response.name ;
                });
            }



            // This function is called when someone finishes with the Login
              // Button.  See the onlogin handler attached to it in the sample
              // code below.
              function checkLoginState() {
                FB.getLoginStatus(function(response) {
                  statusChangeCallback(response);
                  console.log ("checkLoginState fired")
                }); 
              }

              window.fbAsyncInit = function() {
                  FB.init({
                    appId      : '465515803652776',
                    cookie     : true,  // enable cookies to allow the server to access 
                                        // the session
                    xfbml      : true,  // parse social plugins on this page
                    version    : 'v2.5' // use graph api version 2.5
                  });

                  // Now that we've initialized the JavaScript SDK, we call 
                  // FB.getLoginStatus().  This function gets the state of the
                  // person visiting this page and can return one of three states to
                  // the callback you provide.  They can be:
                  //
                  // 1. Logged into your app ('connected')
                  // 2. Logged into Facebook, but not your app ('not_authorized')
                  // 3. Not logged into Facebook and can't tell if they are logged into
                  //    your app or not.
                  //
                  // These three cases are handled in the callback function.




       function checkLoginState() {
            FB.getLoginStatus(function(response) {
              statusChangeCallback(response);
              console.log ("checkLoginState fired")
            }); 
          }


                  FB.getLoginStatus(function(response) {
                    statusChangeCallback(response);
                    console.log ("getLoginStatus fired")
                      
                  });

              };

*/
    }

})();



