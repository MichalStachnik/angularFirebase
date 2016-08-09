(function(){
    "use strict";
    
    angular
        .module("myApp")
        .factory("todoFactory", function($http){
            
            function searchW(){
                return $http.get('https://api.forecast.io/forecast/b1ec266c68f5a96febf5e6bc2b5b4a45/37.8267,-122.423');
            }
        
            return {
                searchW: searchW   
            }
    });
})();