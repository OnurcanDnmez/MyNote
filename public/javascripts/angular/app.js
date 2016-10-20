var app = angular.module('app', ['ngCookies', 'gg.editableText', 'btford.socket-io'])
    .factory('mySocket', function (socketFactory) {
        return socketFactory();
    }).config(function (EditableTextHelperProvider) {
        EditableTextHelperProvider.setWorkingText('<span class="fa fa-spin fa-spinner"></span>');
    })
    .controller('MainController', ['$http', '$scope', '$cookies', '$q', '$timeout', 'mySocket',
        function ($http, $scope, $cookies, $q, $timeout, mySocket) {

            $scope.selectedNote={}
            $scope.noteList = [];
            $scope.tagList = [];

            mySocket.on('newNote', function (msg) {
                $scope.noteList.push(msg);
            });

            mySocket.on('updatedNote',function(msg){
                $http.get('/notes', {headers: {'Authorization': $cookies.get('token')}}).
                then(function (response) {
                    $scope.noteList=[];
                    $scope.noteList=$scope.noteList.concat(response.data);
                });
            });

            $http.get('/notes', {headers: {'Authorization': $cookies.get('token')}}).
            then(function (response) {
                $scope.noteList=$scope.noteList.concat(response.data);
            });


            $http.get('/tags', {headers: {'Authorization': $cookies.get('token')}}).
            then(function (response) {
                $scope.tagList=$scope.tagList.concat(response.data);
            });

            $scope.show = function (note) {
                $scope.selectedNote = note;
            }


            $scope.titleUpdate = function saveContent(value) {
                var dfd = $q.defer();

                var noteObj={};
                if($scope.selectedNote._id ){
                    noteObj={_id:$scope.selectedNote._id,
                        title:value,text:$scope.selectedNote.text}
                }else{
                    noteObj={   title:value,text:$scope.selectedNote.text}
                }

                $http.post('/notes', noteObj
                    ,{headers: {'Authorization': $cookies.get('token')}}).
                then(function (response) {
                    if (response.status == 200) {
                        dfd.resolve(value)
                    } else {
                        dfd.reject();
                    }
                });

                return dfd.promise;
            }
            $scope.textUpdate = function saveContent(value) {
                var dfd = $q.defer();


                var noteObj={};
                if($scope.selectedNote._id){
                    noteObj={ _id:$scope.selectedNote._id,
                        title:$scope.selectedNote.title,text:value}
                }else{
                    noteObj={title:$scope.selectedNote.title,text:value}
                }


                $http.post('/notes',noteObj
                    ,{headers: {'Authorization': $cookies.get('token')}}).
                then(function (response) {
                    if (response.status == 200) {
                        dfd.resolve(value)
                    } else {
                        dfd.reject();
                    }
                });

                return dfd.promise;
            }
            $scope.newNote=function newNote(){
                $scope.selectedNote={};
            }
        }]);