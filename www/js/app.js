// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('liteTech', ['ionic','liteTech.controller','liteTech.service','ionicLazyLoad','ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    setTimeout(function() {
      // $cordovaSplashscreen.hide();
    }, 5000)
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})
.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('home', {
    url: "/home",
    templateUrl : "templates/home.html"
  })
  .state('residence', {
    url: "/residence",
    templateUrl : "templates/residence.html"
  })
  .state('result', {
    url: "/result",
    templateUrl : "templates/result.html"
  })
  $urlRouterProvider.otherwise("/home");

});
