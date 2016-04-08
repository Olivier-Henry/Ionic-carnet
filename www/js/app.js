// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic'])

        .run(function($ionicPlatform) {
            $ionicPlatform.ready(function() {
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                    // for form inputs)
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                    // Don't remove this line unless you know what you are doing. It stops the viewport
                    // from snapping when text inputs are focused. Ionic handles this internally for
                    // a much nicer keyboard experience.
                    cordova.plugins.Keyboard.disableScroll(true);
                }
                if (window.StatusBar) {
                    StatusBar.styleDefault();
                }
            });
        });

app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('list', {
        url: '/list',
        templateUrl: 'views/liste.html',
        controller: 'ListController'
    });

    //route par défaut
    $urlRouterProvider.otherwise('/list');
});

app.controller('ListController', function($scope, $state, noteManager) {
    $scope.notes = noteManager.list();

    console.log($scope.notes);

    $scope.showAddView = function() {
        $state.go('ajout');
    };
});

app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('ajout', {
        url: '/ajout',
        templateUrl: 'views/ajout.html',
        controller: 'AjoutController'
    });

    $stateProvider.state('edit', {
        url: '/edit/:noteId',
        templateUrl: 'views/ajout.html',
        controller: 'EditController'
    });

    //route par défaut
    $urlRouterProvider.otherwise('/list');
});

app.controller('AjoutController', function($scope, noteManager, $state) {
    $scope.newNote = {
        title: "",
        content: "",
        id: new Date().getTime().toString()
    };

    $scope.save = function() {
        noteManager.ajout($scope.newNote);
        $state.go('list');
    };
});

app.controller('EditController', function($scope, $state, noteManager) {
    var noteId = $state.params.noteId;
    $scope.newNote = angular.copy(noteManager.get(noteId));

    $scope.save = function() {
        noteManager.update($scope.newNote);
        $state.go('list');
    };
});

app.service('noteManager', function($window) {
    var notes = angular.fromJson($window.localStorage['persistentNotes']) || [];

    function persist() {
        $window.localStorage['persistentNotes'] = angular.toJson(notes);
    }

    return {
        list: function() {
            return notes;
        },
        ajout: function(newNote) {
            notes.push(newNote);
            persist();
        },
        get: function(noteId) {
            note = {};
            found = false;
            for (var i = 0; i < notes.length && !found; i++) {
                if (notes[i].id == noteId) {
                    note = notes[i];
                    found = true;
                }
            }
            return note;
        },
        update: function(updatedNote) {
            found = false;
            for (var i = 0; i < notes.length && !found; i++) {
                if (notes[i].id == updatedNote.id) {
                    notes[i] = updatedNote;
                    persist();

                    found = true;
                }
            }
        }

    };
});