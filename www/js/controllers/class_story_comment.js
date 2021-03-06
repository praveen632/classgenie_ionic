var comments = angular.module('starter');

comments.controller('comment_StoryCtrl',['$scope','$location','$window','$ionicPopup','$ionicPopover','$ionicHistory','$ionicLoading',function($scope,$location,$window,$ionicPopup,$ionicPopover,$ionicHistory,$ionicLoading){
loader.dependency = $ionicLoading;

var stored_classId=Service_Store.getLocal('das_classid');
var stored_memberNo= Service_Store.getLocal('das_member_no');
var storyId= Service_Store.getLocal('teacher_post_id');
$scope.nameOfClass=Service_Store.getLocal('das_classname');
$scope.imagePath = global.config['file_url']+global.config['image_path'];
var userImage=Service_Store.getLocal('post_userimage');
$scope.imageurl=userImage;

$scope.pagestatus=Service_Store.getLocal('frompage');
$scope.data={};
$scope.liked=false;
$scope.unliked=true;

$scope.removeDollerChar = function(string){
   return string.replace('$','?');
}
$scope.randNo= global.randomNumber();

loadData=function(){
   ajaxloader.async=false;
   global.checkNetworkConnection($ionicPopup);
   ajaxloader.load(global.config['api_url']+'/classstories/commentDetail?token='
    +Service_Store.getLocal('app_token')+"&story_id="+storyId+"&teacher_ac_no="+stored_memberNo,
    function(resp){
        ajaxloader.async=true;
        var res1=$.parseJSON(resp);
        if(res1.status == "Success")
        {
          var json =res1.post;
          $scope.image=json[0].image;
          $scope.postId=json[0].id;
          $scope.like =json[0].likes;
          $scope.like_status=json[0].status;
          $scope.teacher_ac_no=json[0].teacher_ac_no;
          $scope.message=json[0].message;
          $scope.ext=json[0].ext;
          $scope.items=res1.comment_list
          $scope.username=json[0].username;
          if($scope.username){
            $scope.teacher_name=$scope.username;
            $scope.items=res1.comment_list;
             $scope.commentCount=$scope.items.length;
             console.log("comment count"+$scope.commentCount);
          }else{
            $scope.teacher_name=res1.teacher_name[0].name;
             //$scope.teacher_name=res1.teacher_name[0].name;
              $scope.items=res1.comment_list;
              $scope.commentCount=$scope.items.length;
              $scope.teacher_image=res1.teacher_name[0].image;
              console.log("else comment count"+$scope.commentCount);
          }


        if(userImage=="" || userImage== undefined ){
            $scope.imgURI="img/chat_user.png";
   
          }else{
                     $scope.imgURI=global.config['file_url']+global.config['image_path']+'profile_image/'+$scope.image;

          }

          

         }else{
          global._alert({template: "No post available now..", dependency:$ionicPopup});
        }

      });
       

       var value1= $scope.teacher_ac_no.toString();
       var res = value1.slice(0,1);
     
      if(res==4){
           $scope.imagefolder="student_stories";
      }else{
        $scope.imagefolder="class_stories";
      }

       $scope.path_url=$scope.imagePath+$scope.imagefolder+"/"+$scope.image;
       

     }
      if(userImage=="" || userImage== undefined ){
            $scope.imgURI="img/chat_user.png"+'?'+global.randomNumber();
   
          }else{
                     $scope.imgURI=global.config['file_url']+global.config['image_path']+'profile_image/'+$scope.image+'?'+global.randomNumber();

          }

$scope.teacher_img=global.config['file_url']+global.config['image_path']+'profile_image/'+ $scope.teacher_image+'?'+global.randomNumber();
loadData();

//comment on post 
$scope.sendMessage=function(){


  
   global.checkNetworkConnection($ionicPopup);
   ajaxloader.async=false;
   ajaxloader.loadURL(global.config['api_url']+'/classstories/comment?token='+Service_Store.getLocal('app_token')+"&student_no=",
    {
      
      story_id:storyId,
      member_no:stored_memberNo,
      class_id:stored_classId,
      comment:$scope.data.message,
      sender_ac_no:stored_memberNo,
     },function(resp){
     ajaxloader.async=true;
    if(resp['status'] == "Success")
        {
          global._alert({template: "Comment successfully...", dependency:$ionicPopup});
          loadData();
          $scope.data.message="";

          }else{
          global._alert({template: "Comment not send...", dependency:$ionicPopup});
        }
    });

} 
//open comment menu 
 $scope.openCommentMenu=function($event){

  $scope.popover_items=[{name:"Edit"},{name:"Delete"}];
    var template = '<ion-popover-view class="post_dropdown">'
    +'<ul class="list post_drop_list">'
    +'<li class="item" ng-click="editPost()"><a>Edit </a></li>'
    +'<li class="item" ng-click="deletePost()"><a>Delete</a></li>'
    
    +'</ul>'
    +'</ion-popover-view>';

   $scope.popover = $ionicPopover.fromTemplate(template, {
    scope: $scope
   });


   $scope.popover.show($event);

   $scope.closePopover = function() {
     $scope.popover.hide();
   };

   $scope.$on('popover.hidden', function() {
     // Execute action
    });

 //function for open edit post
    $scope.editPost=function(){
      $scope.popover.hide();
    
     $window.location.href="#/edit_post"
    }
  // function for delete post  
    $scope.deletePost=function(){      
      var storyId= Service_Store.getLocal('teacher_post_id');
      $scope.popover.hide();
      global.checkNetworkConnection($ionicPopup);
      ajaxloader.async=false;
      ajaxloader.loadURL(global.config['api_url']+'/classstories/delete?token='+Service_Store.getLocal('app_token'),
    {
       id:storyId
      
    },function(resp){
      ajaxloader.async=true;


       if(resp['status'] == "Success")
        {
          global._alert({template: "Post deleted successfully..", dependency:$ionicPopup});
         $window.location.href="#/classstory";

          }else{
          global._alert({template: "Post not deleted..", dependency:$ionicPopup});
        }
    });

   }

}
//like the post
  $scope.openLikePage=function(){
 
   var storyId=$scope.postId;
   global.checkNetworkConnection($ionicPopup);
   ajaxloader.async=false;
   ajaxloader.loadURL(global.config['api_url']+'/classstories/likes?token='+Service_Store.getLocal('app_token'),
    {
      story_id:storyId,
      class_id: stored_classId,
      member_no:stored_memberNo,
      status:"1"

    },function(resp){
     ajaxloader.async=true;

        if(resp['status'] == "Success")
        {
          $scope.liked=true;
          $scope.unliked=false;
         //loadData();
         $state.go('tab.classstory', {}, { reload: true });
        }else{
          global._alert({template: "No post liked", dependency:$ionicPopup});
        }

      });
}
//delete comment  http://localhost:3000/classstories/comment/delete?id=1&token=aforetechnical@321
$scope.delete_comment=function(){
var comment_id= this.item.id;
global.checkNetworkConnection($ionicPopup);
   ajaxloader.async=false;
   ajaxloader.loadURL(global.config['api_url']+'/classstories/comment/delete?token='+Service_Store.getLocal('app_token'),
    {
      id:comment_id,
      
    },function(resp){
     ajaxloader.async=true;

        if(resp['status'] == "Success")
        {
           global._alert({template: "Comment deleted successfully..", dependency:$ionicPopup});
           loadData();
        }else{
          global._alert({template: "No post liked", dependency:$ionicPopup});
        }

      });



 }
//back button 
$scope.comment_goBack=function(){
  //$window.location.href="#/classstory";

  $ionicHistory.goBack();
}

}]);

