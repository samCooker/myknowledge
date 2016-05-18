(function () {
  'use strict';
   appModule.controller('treecontrolController', ['$scope', function ($scope) {

     var names = ['Homer', 'Marge', 'Bart', 'Lisa', 'Mo'];
     function createSubTree(level, width, prefix) {
       if (level > 0) {
         var res = [];
         for (var i=1; i <= width; i++)
           res.push({ "label" : "Node " + prefix + i, "id" : "id"+prefix + i, "i": i, "children": createSubTree(level-1, width, prefix + i +"."), "name": names[i%names.length] });
         return res;
       }
       else
         return [];
     }
     $scope.treedata=createSubTree(2, 4, "");
     $scope.opts = {
       dirSelectable: false,
       injectClasses:{
         ul:'animate-if'
       }
     };
     $scope.showSelected = function(sel,selected) {
       console.log(sel);
       console.log(selected);
       $scope.selectedNode = sel;
     };

   }])
}());
