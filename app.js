angular.module('myApp', ['firebase'])

.controller('MainCtrl', function($scope, myService, $http, $firebaseArray){
                                                                        //path to taskList array
    var referenceURL = new Firebase('https://mstodolist.firebaseio.com/-KJE_tqP6iLiwkGBYNdf');
    //function firebaseArray()
    //{
        //return {
            //ref: $firebaseArray(referenceURL)
        //}
    //}
    //var firebase = firebaseArray.ref;

    $scope.fbArray = $firebaseArray(referenceURL);
    $scope.taskList = [];                           //creates array to hold task objects
    $scope.fbArray.$add($scope.taskList);           //instantiating the taskList array in firebase
    $scope.showTableHeaders = false;
    $scope.api = 'b1ec266c68f5a96febf5e6bc2b5b4a45/';
   
    //hacky way to check if todo list is populated
    referenceURL.child(0).once('value', function(response){
        var isEmpty = (response.val() !== null);
        if(!isEmpty){
            $scope.showTableHeaders = true;
        }
    });
    
    $scope.searchEnter = function(){
        if(event.which == 13){
            $scope.addTask();   
        }
    };
    $scope.addTask = function(){
        //crappy form validation for now
        if($scope.title != '' && $scope.title != undefined && $scope.priority != undefined && $scope.dueDate != undefined && $scope.dueDate != ''){
            var taskObject = 
                {
                    title: $scope.title,
                    priority: $scope.priority,
                    dueDate: $scope.dueDate
                    //completed: $scope.completed
                };
            $scope.taskList.push(taskObject);
            //adding the newest element of the taskList array to firebase
            $scope.fbArray.$add($scope.taskList[$scope.taskList.length - 1]); 
            //resets fields
            $scope.title = "";
            $scope.priority = "";
            $scope.dueDate = "";
            //$scope.completed = "";
        }
    };
    $scope.deleteTodo = function(task){
        if(confirm("are you sure?")){
            $scope.fbArray.$remove(task);
        }
    }
    $scope.showEdit = function(task){
        $scope.editing = !$scope.editing;
        $scope.title = task.title;
        $scope.priority = task.priority;
        $scope.dueDate = task.dueDate;
        //$scope.completed = task.completed;
        $scope.id = task.$id;
    }
    $scope.editFormSubmit = function(){
        var id = $scope.id;
        //returns the item in the fbArray
        var record = $scope.fbArray.$getRecord(id);
        record.title = $scope.title;
        record.priority = $scope.priority;
        record.dueDate = $scope.dueDate;
        //record.completed = $scope.completed;
        console.log(record);
        $scope.fbArray.$save(record);
    }
    
    //--------------------------------------
    //search weather function on button click
    $scope.searchW = function(){
        $scope.url = "https://api.forecast.io/forecast/" + $scope.api + $scope.latitude + ',' + $scope.longitude + '?callback=JSON_CALLBACK';
        console.log($scope.url);
        //$http.get doesn't work because of header access control problems
        $http.jsonp($scope.url).success(function(response){
            console.log(response);
            $scope.temp = response.currently.apparentTemperature;
            $scope.sum = response.currently.summary;
        });     
    }
})

.service('myService', function(){
    //var self = this;
    this.deleteTodo = function(todo){
        console.log("the " + todo.title + " task has been deleted");
    };
    
});