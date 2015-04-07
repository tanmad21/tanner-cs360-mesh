angular.module('weatherNews', ['ui.router'])
.controller('MainCtrl',[
  '$scope',
  'postFactory',
  function($scope,postFactory) {
    postFactory.getAll();
    $scope.test = 'Hello World!',
    $scope.posts = postFactory.posts;
//    $scope.addPost = function() {
//      $scope.posts.push({title:$scope.formContent,upvotes:0,comments:[]});
//      $scope.formContent='';
//    };
    $scope.addPost = function(){
      if($scope.title === '') { return; }
      postFactory.create({
        title: $scope.formContent,
        upvotes: 0,
        comments:[]
      });
      $scope.formContent = '';
    };
    $scope.incrementUpvotes = function(comment){
      console.log("incrementUp "+postFactory.post._id+" comment "+comment._id);
      postFactory.upvoteComment(postFactory.post, comment);
    };
//    $scope.incrementUpvotes = function(post) {
//      postFactory.upvote(post);
//    };
  }
])
.controller('PostCtrl', [
  '$scope',
  '$stateParams',
  'postFactory',
  function($scope,$stateParams,postFactory){
    $scope.test = 'Hello world!';
    $scope.post = postFactory.posts[$stateParams.id];
    $scope.addComment = function(){
      console.log(postFactory.post);
      if($scope.body === '') { return; }
      postFactory.addNewComment(postFactory.post._id, {
        body:$scope.body
      }).success(function(comment) {
        mypost.comments.push(comment); // Update the version in the array
        postFactory.post.comments.push(comment);// pdate the version in the view
      });
      $scope.body = '';
    };
//    $scope.addComment = function() {
//      if($scope.body === '') { return; }
//      $scope.post.comments.push({body:$scope.body,upvotes:0});
//      $scope.body='';
//    };
    $scope.incrementUpvotes = function(post) {
      console.log(post);
      postFactory.upvote(post);
    };
  }
])
.factory('postFactory', ['$http', function($http){
  var o = {
    posts: [],
    post: {}
  };
  o.getAll = function() {
    return $http.get('/posts').success(function(data){
      angular.copy(data, o.posts);
    });
  };
  o.create = function(post) {
    return $http.post('/posts', post).success(function(data){
      o.posts.push(data);
    });
  };
  o.upvote = function(post) {
    return $http.put('/posts/' + post._id + '/upvote')
      .success(function(data){
        post.upvotes += 1;
      });
  };
  o.upvoteComment = function(selPost, comment) {
    return $http.put('/posts/' + selPost._id + '/comments/'+ comment._id + '/upvote')
      .success(function(data){
        comment.upvotes += 1;
      });
  };
  o.addNewComment = function(id,comment) {
    return $http.post('/posts/' + id +'/comments' , comment);
  }
  return o;
}])
.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: '/home.html',
        controller: 'MainCtrl'
      })
      .state('posts', {
          url: '/posts/{id}',
          templateUrl: '/posts.html',
          controller: 'PostCtrl'
       });
    $urlRouterProvider.otherwise('home');
  }
])
;


