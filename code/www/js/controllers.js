angular.module('songhop.controllers', ['ionic', 'songhop.services'])


/*
Controller for the discover page
*/
.controller('DiscoverCtrl', function($scope, $ionicLoading, $timeout, User, Recommendations) {
  // helper functions for loading
  var showLoading = function() {
    $ionicLoading.show({
      template: '<i class="ion-loading-c"></i>',
      noBackdrop: true
    });
  }

  var hideLoading = function() {
    $ionicLoading.hide();
  }

  // set loading to true first time while we retrieve songs from server.
  showLoading();

  // get our first songs
  Recommendations.init()
    .then(function(){

      $scope.currentSong = Recommendations.queue[0];

      return Recommendations.playCurrentSong();

    })
    .then(function(){
      // turn loading off
      hideLoading();
      $scope.currentSong.loaded = true;
    });

    // fired when favorite or skip a song.
  $scope.sendFeedback = function (bool) {

    // add to favorites if favorited
    if (bool) User.addSongToFavorites($scope.currentSong);

    // set variable for the correct animation sequence
    $scope.currentSong.rated = bool;
    $scope.currentSong.hide = true;

    // prepare next song
    Recommendations.nextSong();

    // update current song in scope, timeout to allow animation to complete
    $timeout(function() {
      $scope.currentSong = Recommendations.queue[0];
      $scope.currentSong.loaded = false;
    }, 250);

    Recommendations.playCurrentSong().then(function() {
      $scope.currentSong.loaded = true;
    });
  }

  // retrieving next album artwork image
  $scope.nextAlbumImg = function() {
    if (Recommendations.queue.length > 1) {
      return Recommendations.queue[1].image_large;
    }
    // return empty string if no album artwork available next.\
    return '';
  }

})


/*
Controller for the favorites page
*/
.controller('FavoritesCtrl', function($scope, $window, User) {
  // get the list of our favorites from the user service
  $scope.favorites = User.favorites;

  $scope.openSong = function(song) {
  $window.open(song.open_url, "_system");
  }
  $scope.removeSong = function(song, index) {
  User.removeSongFromFavorites(song, index);
  }
})


/*
Controller for our tab bar
*/
.controller('TabsCtrl', function($scope, User, Recommendations) {
  // expose num of new favorites to scope
  $scope.favCount = User.favoriteCount;

  // stop audio & reset new favorites when going to favorites tab
  $scope.enteringFavorites = function() {
    User.newFavorites = 0;
    Recommendations.haltAudio();
  }
  $scope.leavingFavorites = function() {
  Recommendations.init();
  }
});
