angular.module('myApp', []);

var timestamp = Date.now();

console.log(timestamp);

var myController = function($scope) {    
    $scope.myInput = "world!";
    $scope.timestamp = timestamp;
};   
  
angular                
  .module('myApp')     
  .controller('myController', myController ); 
