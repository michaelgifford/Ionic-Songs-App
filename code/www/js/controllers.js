angular.module('songhop.controllers', ['ionic', 'songhop.services'])


/*
Controller for the discover page
*/
.controller('DiscoverCtrl', function($scope, $timeout, User, Recommendations) {
  // get our first songs
  Recommendations.getNextSongs()
    .then(function(){
      $scope.currentSong = Recommendations.queue[0];
    });

  $scope.sendFeedback = function (bool) {
      // first, add to favorites if they favorited
      if(bool) User.addSongToFavorites($scope.currentSong);
      //set variable for the correct animation sequence
      $scope.currentSong.rated = bool;
      $scope.currentSong.hide = true;

      // prepare next song
      Recommendations.nextSong();

      $timeout(function() {
        // $timeout to allow animation to complete
        $scope.currentSong = Recommendations.queue[0];
      }, 250)
  }

})


/*
Controller for the favorites page
*/
.controller('FavoritesCtrl', function($scope, User) {
  // get the list of our favorites from the user service
  $scope.favorites = User.favorites;

  $scope.removeSong = function(song, index) {
  User.removeSongFromFavorites(song, index);
  }
})


/*
Controller for our tab bar
*/
.controller('TabsCtrl', function($scope) {

});
